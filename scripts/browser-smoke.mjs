import { createReadStream } from 'node:fs';
import { access } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { cards } from '../src/data/cards.js';

const host = '127.0.0.1';
const port = 4173 + Math.floor(Math.random() * 200);
const baseUrl = `http://${host}:${port}`;
const distDir = fileURLToPath(new URL('../dist/', import.meta.url));

const contentTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.jpg': 'image/jpeg',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
};

const assert = (condition, message) => {
    if (!condition) {
        throw new Error(message);
    }
};

const resolveFilePath = (urlPath) => {
    const normalizedPath = normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, '');
    const relativePath = normalizedPath === '/' || normalizedPath === '\\' || normalizedPath === ''
        ? 'index.html'
        : normalizedPath.replace(/^[/\\]+/, '');

    return join(distDir, relativePath);
};

const createStaticServer = async () => {
    await access(join(distDir, 'index.html'));

    const server = createServer(async (request, response) => {
        const requestUrl = new URL(request.url ?? '/', baseUrl);
        const filePath = resolveFilePath(requestUrl.pathname);
        const extension = extname(filePath);
        const contentType = contentTypes[extension] ?? 'application/octet-stream';

        try {
            await access(filePath);
            response.writeHead(200, { 'Content-Type': contentType });
            createReadStream(filePath).pipe(response);
        } catch {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Not found');
        }
    });

    await new Promise((resolve, reject) => {
        server.listen(port, host, (error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(undefined);
        });
    });

    return server;
};

const closeServer = async (server) => {
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(undefined);
        });
    });
};

const main = async () => {
    const server = await createStaticServer();
    let browser;

    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        await context.clearCookies();
        await context.addInitScript(() => {
            localStorage.clear();
            sessionStorage.clear();
        });
        const page = await context.newPage();
        page.on('pageerror', (error) => {
            throw error;
        });

        await page.goto(baseUrl, { waitUntil: 'networkidle' });

        const gate = page.locator('#entry-gate');
        const input = page.locator('#entry-gate-input');
        const submit = page.locator('#entry-gate-submit');
        const error = page.locator('#entry-gate-error');
        const firstCard = page.locator(`[data-card="${cards[0].slug}"]`);

        const gateInitiallyVisible = await gate.isVisible().catch(() => false);

        if (gateInitiallyVisible) {
        await input.fill('0000');
        await submit.click();
        await error.waitFor();
        assert((await error.textContent()) === '비밀번호가 올바르지 않습니다.', 'Wrong password message should be shown');

        await input.fill('0228');
        await submit.click();
        await gate.waitFor({ state: 'hidden' });
        }

        await page.locator('#cards-grid').waitFor();
        assert((await page.locator('#theme-toggle').count()) === 0, 'Theme toggle should not be rendered');
        assert(await firstCard.isVisible(), 'First archive card should be visible after unlock');

        await page.reload({ waitUntil: 'networkidle' });
        await page.locator('#cards-grid').waitFor();
        await delay(500);

        const gateStillVisible = await page.locator('#entry-gate').isVisible().catch(() => false);
        assert(!gateStillVisible, 'Gate should stay unlocked after reload while the stored code remains valid');

        const cardCount = await page.locator('[data-card]').count();
        assert(cardCount === cards.length, 'Rendered card count should match card data');

        const [popup] = await Promise.all([
            page.waitForEvent('popup'),
            firstCard.click(),
        ]);

        assert(popup.url().startsWith(cards[0].href), 'Clicking the first card should open the matching external URL');
        await popup.close();

        await browser.close();
        browser = undefined;
    } finally {
        if (browser) {
            await browser.close();
        }

        await closeServer(server);
    }
};

main().catch((error) => {
    const errorMessage = String(error?.message ?? error);

    if (error?.code === 'ENOENT') {
        console.error('dist/index.html is missing. Run `npm run build` before `npm run check:browser`.');
    } else if (error?.code === 'EPERM' || errorMessage.includes('spawn EPERM')) {
        console.warn('SKIP: Browser smoke requires permission to launch Chromium in this environment.');
        process.exit(0);
        return;
    } else {
        console.error(error);
    }

    process.exit(1);
});
