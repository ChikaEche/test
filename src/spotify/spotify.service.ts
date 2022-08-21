import { Injectable, Logger } from '@nestjs/common';
import { Browser, ElementHandle, Page } from 'puppeteer';

@Injectable()
export class SpotifyService {

  private readonly LOGGER = new Logger(SpotifyService.name);
  private readonly SPOTIFY_ONLOAD_PAGE =
   "div[data-testid='infinite-scroll-list']";

  public async play(page: ElementHandle, browser: Browser) {
    try {
      await page.click({ button: 'middle' });
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector('div.PFgcCoJSWC3KjhZxHDYH');
      await openedTabPage.bringToFront();
      const musicList = await openedTabPage.$$('div.PFgcCoJSWC3KjhZxHDYH');
      await this.playMusic(musicList, openedTabPage);
    } catch(e) {
      this.LOGGER.error('Error while playing spotify', e);
    }
  }

  public async playMusic(elements: ElementHandle[], page: Page) {
    this.LOGGER.log(elements.length + 'yug');
    for(const element of elements) {
      try {
        await element.click();
        await page.waitForTimeout(60000 * 4);
        await element.click();
      } catch(e) {
        this.LOGGER.error("Error while playing music in spotify", e);
      }
    }
  }
}
