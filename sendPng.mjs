import 'dotenv/config'
import pdf2img from 'pdf-img-convert'
import { WebhookClient } from 'discord.js'

const buf = Buffer.from((await pdf2img.convert('main.pdf'))[0])

const client = new WebhookClient({url: process.env.DISCORD_WEBHOOK_URL})
await client.send({
  files: [buf]
})
