import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import process from 'node:process';
import { chromium } from 'playwright';
import { cards } from '../src/data/cards.js';

const host = '127.0.0.1';
const port = 4173;
const baseUrl = `http://${host}:${port}`;

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const waitForServer = async () => {
    for (let attempt = 0; attempt < 40; attempt += 1) {
        try {
            const response = await fetch(baseUrl);

            if (response.ok) {
                return;
            }
        } catch {
            await delay(500);
            continue;
        }

        await delay(500);
    }

    throw new Error('Timed out waiting for preview server');
};

const stopPreviewServer = async (previewServer) => {
    previewServer.kill();

    try {
        await Promise.race([
            once(previewServer, 'exit'),
            delay(5_000),
        ]);
    } catch {
        return;
    }
};

const main = async () => {
    const previewCommand = `npm.cmd run preview -- --host ${host} --port ${port} --strictPort`;
    const previewServer = spawn(
        process.env.ComSpec ?? 'cmd.exe',
        ['/d', '/s', '/c', previewCommand],
        {
            cwd: process.cwd(),
            stdio: 'pipe',
            windowsHide: true,
        },
    );

    let previewOutput = '';

    const recordOutput = (chunk) => {
        previewOutput += chunk.toString();
    };

    previewServer.stdout.on('data', recordOutput);
    previewServer.stderr.on('data', recordOutput);

    let browser;

    try {
        await waitForServer();

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
        await gate.waitFor({ state: 'detached' });

        assert(await page.locator('#theme-toggle').isVisible(), 'Theme toggle should remain visible after unlock');
        assert(await firstCard.isVisible(), 'First archive card should be visible after unlock');

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
    } catch (error) {
        if (browser) {
            await browser.close();
        }

        await stopPreviewServer(previewServer);
        console.error(previewOutput);
        throw error;
    }

    await stopPreviewServer(previewServer);
};

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
