import { Injectable } from '@nestjs/common';
import { Browser, ElementHandle } from 'puppeteer';

@Injectable()
export class IHeartService {
  private readonly I_HEART_PLAY_BUTTONS = "button[data-test='play-button']";

  public async play(page: ElementHandle, browser: Browser) {
    try {
      await page.click({ button: 'middle' });
      const pages = await browser.pages();
      const openedTabPage = pages.pop();
      await openedTabPage.waitForSelector('div div div section');
      await openedTabPage.bringToFront();
      await openedTabPage.waitForTimeout(30000);
      const playButtons = await openedTabPage.$$(this.I_HEART_PLAY_BUTTONS);
      console.log(playButtons.length)
      for(const playButton of playButtons) {
        await playButton.click();
        await openedTabPage.waitForTimeout(60000);
      }
    } catch(e) {
      console.error('Error Playing I heart', e);
    }
  }
}
