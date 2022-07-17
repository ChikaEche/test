import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import { auth } from "../config/configuration";

@Injectable()
export class SpreakerService {
  private readonly LOGGER = new Logger(SpreakerService.name);
  private readonly PAGE_URL = "https://spreaker.com";
  private readonly PAGE_HEADER_SELECTOR = "div.header";
  private readonly LOGIN_SELECTOR = "a.header__auth_login";
  private readonly LOGIN_ONLOAD_SELECTOR = "div.header__content";
  private readonly PROFILE_DROPDOWN_SELECTOR = "div#header-dropdown-btn-pic";
  private readonly PUBLIC_PROFILE_SELECTOR = "a.header__dropdown-list-link";
  private readonly DROPDOWN_SELECTOR = "ul.header__dropdown-list";
  private readonly USER_SHOWS_SELECTOR = "div.user__shows";
  private readonly PODCAST_SHOWS_SELECTOR = this.USER_SHOWS_SELECTOR +
   " div.user__shows-list div.user__show div a.thumb";
  private readonly PODCAST_SELECTOR = "div.podcast__episodes-item-title a";
  private readonly PLAY_SELECTOR = "div.play-button__container a";
  private readonly ONE_SECOND_TO_MILLISECONDS = 1000;
  private readonly ONE_MINUTE_TO_MILLISECONDS = 60000;
  private readonly ONE_HOUR_TO_MILLISECONDS = 3600000;

  constructor() {
    this.run();
  }

  private async run() {
    const download_path = path.resolve('./spreaker_downloads');
    const browser = await this.getBrowser();
    const page = await this.generateBrowserPage(browser);
    const client = await page.target().createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: download_path
    });
    await this.login(page);
    await this.gotoPodcastPage(page);
    const userShows = await this.getAllUserShows(page);
    await this.iterateThroughUserShows(userShows, browser, page);
  }

  private async iterateThroughUserShows(userShows: puppeteer.ElementHandle[], browser: puppeteer.Browser, page: puppeteer.Page) {
    for(let i = 0; i < 100; i++) {
      for(let userShow of userShows) {
        await this.gotoPodcastEpisodes(userShow, browser);
      }
      await this.closeTabs(browser, page);
    }
  }

  private async closeTabs(browser: puppeteer.Browser, mainPage: puppeteer.Page) {
    const pages = await browser.pages();
    for(let page of pages) {
      if(page != mainPage) {
        await page.close();
      }
    }
  }

  private async gotoPodcastEpisodes(userShow: puppeteer.ElementHandle, browser: puppeteer.Browser) {
    try {
      await userShow.click({button: "middle"});
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector(this.PAGE_HEADER_SELECTOR);
      const podcasts = await openedTabPage.$$(this.PODCAST_SELECTOR);
      for(const podcast of podcasts) {
        await this.playPodcast(podcast, browser);
      }
    } catch(e) {
      this.LOGGER.error("Error getting podcast episodes", e);
    }
  }

  private async playPodcast(podcast: puppeteer.ElementHandle, browser: puppeteer.Browser) {
    try {
      await podcast.click({button: "middle"});
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector(this.PAGE_HEADER_SELECTOR);
      openedTabPage.bringToFront();
      const podcastDurationElement = await openedTabPage.$("div#track_player_time_total");
      const podcastDuration = await podcastDurationElement.evaluate((node) => node.textContent);
      const podcastTime = this.convertPodcastPlayTimeToMilliseconds(podcastDuration);
      await openedTabPage.click("a#track-download");
      await openedTabPage.click(this.PLAY_SELECTOR);
      await openedTabPage.waitForTimeout(podcastTime);
      await openedTabPage.close()
    } catch(e) {
      this.LOGGER.error("Error playing podcast", e);
    }
  }

  private convertPodcastPlayTimeToMilliseconds(timeInString: string) {
    const time = timeInString.split(":");
    let podcastTime = 0;
    podcastTime += +time.pop() * this.ONE_SECOND_TO_MILLISECONDS;
    if(time.length !== 0) {
      podcastTime += +time.pop() * this.ONE_MINUTE_TO_MILLISECONDS;
    } 
    if(time.length !== 0) {
      podcastTime += +time.pop() * this.ONE_HOUR_TO_MILLISECONDS;
    }
    return podcastTime;
  }

  private async getAllUserShows(page: puppeteer.Page) {
    return page.$$(this.PODCAST_SHOWS_SELECTOR);
  }

  private async gotoPodcastPage(page: puppeteer.Page) {
    await page.click(this.PROFILE_DROPDOWN_SELECTOR);
    await page.waitForSelector(this.DROPDOWN_SELECTOR);
    await page.click(this.PUBLIC_PROFILE_SELECTOR);
    await page.waitForSelector(this.USER_SHOWS_SELECTOR);
  }

  private async login(page: puppeteer.Page) {
    await page.click(this.LOGIN_SELECTOR);
    await page.waitForSelector(this.LOGIN_ONLOAD_SELECTOR);
    await page.type("#identity", auth.i);
    await page.type("#password", auth.p);
    await page.click("#login-form-submit");
    await page.waitForSelector(this.PROFILE_DROPDOWN_SELECTOR);
  }

  private async getBrowser() {
    return puppeteer.launch({ 
      headless: false,
      defaultViewport: {
        width:1500,
        height:1080
      }
    });
  }

  private async generateBrowserPage(browser: puppeteer.Browser): Promise<puppeteer.Page> {
    const page = await browser.newPage();
    await page.goto(this.PAGE_URL);
    await page.waitForSelector(this.PAGE_HEADER_SELECTOR);
    return page;
  }
}
