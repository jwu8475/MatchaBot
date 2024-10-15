import Tesseract from "tesseract.js"
import sharp from "sharp"

const { createWorker } = Tesseract
const worker = await createWorker('eng')

async function preprocess(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .grayscale()
            .threshold(150)
            .blur(1)
            .resize(200, 60)
            .toFile(outputPath)
        console.log(`Preprocessed ${inputPath} to ${outputPath}`)
    } catch (error) {
        console.error(`Error preprocessing ${inputPath}: ${error}`)
    }
}
async function solveCaptcha(img) {
for (let i = 0; i < 50  ; i++) {
    await preprocess(`./Backend/Dataset/${i}.png`, `./Backend/ProcessedData/${i}.png`)
    const { data: { text } } = await worker.recognize(`./Backend/ProcessedData/${i}.png`)
    console.log(text)
    }
}
