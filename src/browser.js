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
                "--enable-webgl",
                "--use-gl=egl"
            ]
        });
    }
    return browserPromise;
}