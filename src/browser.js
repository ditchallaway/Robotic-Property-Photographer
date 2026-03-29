import puppeteer from "puppeteer";

let browserPromise;

export function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            executablePath: "/usr/bin/chromium",
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--enable-unsafe-swiftshader",
                "--use-gl=angle",
                "--use-angle=swiftshader"
            ]
        });
    }
    return browserPromise;
}