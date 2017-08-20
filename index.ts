import * as puppeteer from 'puppeteer';

export interface ZeplinProjectToJsonConfig {
    projectId: string;
    login: { username: string, password: string };
    headless?: boolean; // default true
}

export interface ZeplinProject {
    id: string;
    name: string;
    sections: ZeplinSection[];
}

export interface ZeplinSection {
    id: string;
    name: string;
    screens: ZeplinScreen[];
}

export interface ZeplinScreen {
    id: string;
    name: string;
    thumbnail: string; // url
    lastUpdated: string; // iso8601
}

export default async function zeplinProjectToJson(
    config: ZeplinProjectToJsonConfig,
): Promise<ZeplinProject> {
    const browser = await puppeteer.launch({
        headless: (config.headless == null) || config.headless,
    });
    const page = await browser.newPage();
    try {
        await page.goto('https://app.zeplin.io/login', { waitUntil: 'networkidle' });
        await page.focus('[autocomplete=username]');
        await page.type(config.login.username);
        await page.focus('[autocomplete=password]');
        await page.type(config.login.password);
        await page.click('button');
        await page.waitForSelector('#currentUser');
    } catch (err) { // already logged in?
        await page.focus('#currentUser'); // assertion
    }
    await page.goto(`https://app.zeplin.io/project/${ config.projectId }/dashboard`);
    await page.waitForFunction(() => document.readyState === 'complete');
    const result = await page.evaluate((projectId: string) => {
        return {
            id: projectId,
            name: (document.querySelector('#projectName') as HTMLInputElement).value,
            sections: Array.from(document.querySelectorAll('.section')).map(
                $section => ({
                    id: ($section as any).dataset.id,
                    name: ($section.querySelector('.sectionName') as HTMLInputElement).value,
                    screens: Array.from($section.querySelectorAll('.screen')).map(
                        $screen => ({
                            id: ($screen as any).dataset.id,
                            name: ($screen.querySelector('.screenName') as HTMLInputElement).value,
                            thumbnail: ($screen.querySelector('.screenImage') as HTMLImageElement).src,
                            lastUpdated: $screen.querySelector('time')!.getAttribute('datetime'),
                        }),
                    ),
                }),
            ),
        };
    }, config.projectId) as ZeplinProject;
    browser.close();
    return result;
}
