import pdftopic from 'pdftopic'
import fs from 'fs'
import fetch from 'node-fetch'
import formData from 'form-data'
import { Readable } from 'stream'

const pdf = fs.readFileSync('main.pdf')
const buf = await pdftopic.pdftobuffer(pdf, 0)[0]

const form = new formData()
form.append('file1', Readable.from(buf))

await fetch(
  process.env.DISCORD_WEBHOOK_URL,
  {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  }
)