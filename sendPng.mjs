import pdftopic from 'pdftopic'
import fs from 'fs'
import fetch from 'node-fetch'
import formData from 'form-data'

const pdf = fs.readFileSync('main.pdf')
const png = await pdftopic.pdftobuffer(pdf, 0)[0]

const form = new formData()
form.append('file1', png)

await fetch(
  process.env.DISCORD_WEBHOOK_URL,
  {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  }
)