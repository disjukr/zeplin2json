declare module 'puppeteer' {
    import * as EventEmitter from 'events';
    export class Page extends EventEmitter {
        click(selector: string, options?: any): Promise<void>;
        evaluate(pageFunction: Function | string, ...args: any[]): Promise<any>;
        focus(selector: string): Promise<void>;
        goto(url: string, options?: any): Promise<void>;
        type(text: string, options?: any): Promise<void>;
        waitForSelector(selector: string, options?: any): Promise<void>;
        waitForFunction(pageFunction: Function | string, options?: any, ...args: any[]): Promise<void>;
    }
    export class Browser {
        close(): void;
        newPage(): Promise<Page>;
    }
    export function launch(options?: any): Promise<Browser>;
}
