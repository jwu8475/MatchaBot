import puppeteer from "puppeteer";
import { connect } from 'puppeteer-real-browser'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'

dotenv.config()

const { page, browser } = await connect({})

// config
await page.setViewport({ width: 0, height: 0 });
const client = await page.createCDPSession()
await client.send('Page.setDownloadBehavior', {
  behavior: 'allow',
  downloadPath: './Dataset',
})
// all products
//https://www.marukyu-koyamaen.co.jp/english/shop/products/?viewall=1

// USD Currency
const usdCurrency = "?currency=USD"

await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/my-account/", { waitUntil: 'domcontentloaded'});

// select input based on id
const email = await page.$("#username");
const password = await page.$("#password");

// enter email and password
await email.type(process.env.USER_ID);
await password.type(process.env.USER_PASSWORD);

// wait for 1 second
// await new Promise(resolve => setTimeout(resolve, 1000));

// click login
const loginButton = await page.$("button[name='login']");
await loginButton.click();

await new Promise(resolve => setTimeout(resolve, 1500));

// download function
function download(url, filename) {
    const file = fs.createWriteStream(filename)
    https.get(url, function(response) {
        response.pipe(file)
        file.on('finish', () => {
            file.close()
            console.log(`Downloaded ${filename}`)
        })
    })
}

//go to checkout page
await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/cart/checkout/?currency=USD", { waitUntil: 'domcontentloaded' })

for (let i = 0; i < 100; i++) {
    //get captcha
    const captchaImg = await page.$("img[alt='captcha']")
    const captchaImgSrc = await captchaImg.evaluate(el => el.src)

    // save image as png
    await download(captchaImgSrc, `./Backend/Dataset/${i}.png`)

    // refresh page
    await page.reload()
    
}



