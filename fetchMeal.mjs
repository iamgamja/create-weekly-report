import * as school from 'school.hana.js'
import { EmbedBuilder, WebhookClient } from 'discord.js'

const webhookClient = new WebhookClient({ url: process.env.DISCORD_WEBHOOK_URL });

const sch = await school.search({
  SCHUL_NM: process.SCHOOL_NAME,
})[0]
    
const res = await school.meal({
  ...sch,
  
})

const embed = new EmbedBuilder()
  .setTitle('Some Title')
  .setColor(0x00FFFF);
await webhookClient.send({
  content: res.toString(),
  embeds: [embed],
});
