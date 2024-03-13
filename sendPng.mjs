import 'dotenv/config'
// import pdftopic from 'pdftopic'
import pdf2img from 'pdf-img-convert'
import fs from 'fs'
import { WebhookClient } from 'discord.js'

// const pdf = fs.readFileSync('main.pdf')
// const buf = (await pdftopic.pdftobuffer(pdf, 0))[0]
const buf = Buffer.from((await pdf2img.convert('main.pdf'))[0])
console.log(buf)

const client = new WebhookClient({url: process.env.DISCORD_WEBHOOK_URL})

await client.send({
  files: [buf]
})
