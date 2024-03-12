import pdftopic from 'pdftopic'
import fs from 'fs'
import { WebhookClient } from 'discord.js'

const pdf = fs.readFileSync('main.pdf')
const buf = await pdftopic.pdftobuffer(pdf, 0)[0]

const client = new WebhookClient(process.env.DISCORD_WEBHOOK_URL)

await client.send({
  files: [buf]
})
