import { Injectable } from '@nestjs/common';
import { Browser, ElementHandle } from 'puppeteer';

@Injectable()
export class JiosaavnService {

  private readonly JIOSAAVN_ONLOAD_SELECTOR = 'div.o-layout';
  private readonly ALL_PLAYS =
    'div.o-block__img a';

  public async play(page: ElementHandle, browser: Browser) {
    try {
      await page.click({ button: 'middle' });
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector(this.JIOSAAVN_ONLOAD_SELECTOR);
      await openedTabPage.bringToFront();
      const allPlays = await openedTabPage.$$(this.ALL_PLAYS);
      for(const play of allPlays) {
        await this.playEpisode(play, browser);
      }
    } catch(e) {
      console.log('Error playing from Jiosaavn', e);
    }
  }

  private async playEpisode(element: ElementHandle, browser: Browser) {
    try {
      await element.click({ button: 'middle' });
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector('span.o-icon-play-circle');
      const allPlays = await openedTabPage.$$('span.o-icon-play-circle');
      await openedTabPage.bringToFront();
      for(const play of allPlays) {
        await play.hover();
        await openedTabPage.waitForTimeout(30000);
        await play.click();
        await openedTabPage.waitForTimeout(60000 * 4.5);
      }
    } catch(e) {
      console.error('Error playing episode in Jiosaavn', e);
    }
  }
}
