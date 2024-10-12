import puppeteer from "puppeteer";
import { connect } from 'puppeteer-real-browser'

const { page, browser } = await connect({})

// all products
//https://www.marukyu-koyamaen.co.jp/english/shop/products/?viewall=1

// USD Currency
const usdCurrency = "?currency=USD"

await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/my-account/");

// select input based on id
const email = await page.$("#username");
const password = await page.$("#password");

// enter email and password
await email.type("jwu8475@gmail.com");
await password.type("Wilson123123123!");

// wait for 1 second
await new Promise(resolve => setTimeout(resolve, 1000));

// set browser to full screen dynamically
await page.setViewport({ width: 0, height: 0 });

// click login
const loginButton = await page.$("button[name='login']");
await loginButton.click();

await new Promise(resolve => setTimeout(resolve, 500));

//available sample item
// await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/products/1297080c6/")

//limited available item
await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/products/11b1100c1/")

//Aoarashi:
// await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/products/11a1040c1/")

// // select form
const select = await page.$("form[class='variations_form cart']")

const selections = []
// // select items
const selectionItems = await select.$$("dl[class='pa pa-pa_size']")
const availability = await select.$$("div[class='product-form-input-block woocommerce-variation-add-to-cart variations_button']")



let intervalId = setInterval(async () => {
    //check stock

    for (let i = 0; i < selectionItems.length; i++) {
        // format data
        let gram = await selectionItems[i].evaluate(el => el.textContent.slice(4))
        let status = await availability[i].evaluate(el => el.textContent)
        let available = ''
        if (status.slice(0, 12) === 'Out of stock') {
        available = status.slice(0, 12)
    } else {
        available = "In stock"
    }

    // add to selections
    selections.push({
        gram: gram,
        status: available,
        addCart: async function() {
            await availability[i].click()
        }
    })

    //delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(selections)
    // add to cart?
    if (selections[selections.length - 1].status === "In stock") {
        await selections[selections.length - 1].addCart()
        console.log("added to cart successfully")
        clearInterval(intervalId)
        return
    } else {
        console.log("not in stock")
    }

}
}, 3000)

// checkout
// await page.goto("https://www.marukyu-koyamaen.co.jp/english/shop/cart/checkout/");

// setTimeout(async () => {
//     await browser.close();
// }, 3000);