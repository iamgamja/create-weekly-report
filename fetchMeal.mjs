import * as school from 'school.hana.js'
import fs from 'fs'
import { EmbedBuilder, WebhookClient } from 'discord.js'

const webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

const sch = (await school.search({
  SCHUL_NM: process.env.SCHOOL_NAME,
}))[0]

async function fetchMeal(date) {
  try {
    const res = (await school.meal({
      ...sch,
      MLSV_YMD: `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
    }))?.[0]?.DDISH_NM?.replaceAll(/ ?\([0-9.]+\)/g, '')?.replaceAll(/<br\/>/g, '\n')

    return res ?? ''
  } catch {
    return ''
  }
}

const now = new Date()
const utc = now.getTime() + now.getTimezoneOffset()*60*1000
const today = new Date(utc + 9*60*60*1000)

const res = []
for (let i=0; i<5; i++) {
  const tmp = new Date(today.getTime() + i*24*60*60*1000)
  res.push(await fetchMeal(tmp))
}

fs.writeFileSync('meal.json', JSON.stringify(res))

const embed = new EmbedBuilder()
  .setTitle('Some Title')
  .setColor(0x00FFFF);
await webhookClient.send({
  content: JSON.stringify(res),
  embeds: [embed],
});
