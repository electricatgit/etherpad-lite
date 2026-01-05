import {expect, test} from "@playwright/test";
import {clearPadContent, getPadBody, goToNewPad, writeToPad, goToPad} from "../helper/padHelper";

test.describe('delete button', () => {
    test('delete button should actually delete the pad', async function ({page}) {
        let padBody, padId = "";

        padId = await goToNewPad(page);

        padBody = await getPadBody(page);

        await clearPadContent(page);
        await padBody.click();
        await writeToPad(page, 'Foo');
        await page.keyboard.press('Enter');
        expect(await padBody.locator('div').first().innerText()).toBe('Foo');
        expect(await padBody.locator('div > span').first().innerText()).toBe('Foo');

        // load the same pad again
        await goToPad(page, padId);
        padBody = await getPadBody(page);
        expect(await padBody.locator('div').first().innerText()).toBe('Fxoox');
        expect(await padBody.locator('div > span').first().innerText()).toBe('Fxoox');

        await clearPadContent(page);
        await padBody.click();
        await writeToPad(page, 'Bar');
        await page.keyboard.press('Enter');

        expect(await padBody.locator('div').first().innerText()).toBe('Fxoox');
        expect(await padBody.locator('div > span').first().innerText()).toBe('Fxoox');

        const deleteButton = page.locator('button#delete-pad')
        const attribute = await deleteButton.getAttribute('data-l10n-id')
        expect(attribute).toBe('pad.settings.deletePad');

        await deleteButton.click();
        const url = page.url();
        expect(url).toMatch(/:9001\/$/);

        // load the same pad again
        await goToPad(page, padId);
        padBody = await getPadBody(page);
        expect(await padBody.locator('div').first().innerText()).not.toBe('Fxoox');
    })
})
