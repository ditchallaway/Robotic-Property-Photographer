import puppeteer from "puppeteer";

let browserPromise;

export function getBrowser() {
    if (!browserPromise) {
        browserPromise = puppeteer.launch({
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--use-gl=angle",
                "--use-angle=swiftshader",
                "--enable-unsafe-swiftshader"
            ]
        });
    }
    return browserPromise;
}