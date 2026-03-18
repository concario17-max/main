import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';
import { preview } from 'vite';
import { cards } from '../src/data/cards.js';

const host = '127.0.0.1';
const port = 4173 + Math.floor(Math.random() * 200);
const baseUrl = `http://${host}:${port}`;

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const closeServer = async (server) => {
    const httpServer = server.httpServer;

    if (!httpServer) return;

    await new Promise((resolve, reject) => {
        httpServer.close((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(undefined);
        });
    });
};

const main = async () => {
    const previewServer = await preview({
        preview: {
            host,
            port,
            strictPort: true,
        },
    });

    let browser;

    try {
        browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(baseUrl, { waitUntil: 'networkidle' });

        const gate = page.locator('#entry-gate');
        const input = page.locator('#entry-gate-input');
        const submit = page.locator('#entry-gate-submit');
        const error = page.locator('#entry-gate-error');
        const firstCard = page.locator(`[data-card="${cards[0].slug}"]`);

        await gate.waitFor({ state: 'visible' });
        await input.fill('0000');
        await submit.click();
        await error.waitFor();
        assert((await error.textContent()) === '비밀번호가 올바르지 않습니다.', 'Wrong password message should be shown');

        await input.fill('0228');
        await submit.click();
        await gate.waitFor({ state: 'hidden' });

        assert(await page.locator('#theme-toggle').isVisible(), 'Theme toggle should remain visible after unlock');
        assert(await firstCard.isVisible(), 'First archive card should be visible after unlock');

        await page.reload({ waitUntil: 'networkidle' });
        await page.locator('#cards-grid').waitFor();
        await delay(500);

        const gateStillVisible = await page.locator('#entry-gate').isVisible().catch(() => false);
        assert(!gateStillVisible, 'Gate should stay unlocked after reload while the password is unchanged');

        const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        await page.locator('#theme-toggle').click();
        const nextTheme = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        assert(initialTheme !== nextTheme, 'Theme toggle should change the document theme');

        const cardCount = await page.locator('[data-card]').count();
        assert(cardCount === cards.length, 'Rendered card count should match card data');

        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            firstCard.click(),
        ]);

        await popup.waitForLoadState('domcontentloaded');
        assert(popup.url().startsWith(cards[0].href), 'Clicking the first card should open the matching external URL');
        await popup.close();

        await browser.close();
        browser = undefined;
    } finally {
        if (browser) {
            await browser.close();
        }

        await closeServer(previewServer);
    }
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
