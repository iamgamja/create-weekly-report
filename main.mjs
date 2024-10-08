import 'dotenv/config'
import * as school from 'school.hana.js'
import request from 'request'
import fs from 'fs'

const sch = (await school.search({
  SCHUL_NM: process.env.SCHOOL_NAME,
}))[0]
console.log(sch)

function formatDate(date) {
  return `${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
}

async function fetchMeal(date) {
  try {
    console.log(await school.meal({
      ...sch,
      MLSV_YMD: formatDate(date)
    }))
    
    const res = (await school.meal({
      ...sch,
      MLSV_YMD: formatDate(date)
    }))?.[0]?.DDISH_NM?.replaceAll(/ ?\([0-9.]+\)/g, '')?.replaceAll(/<br\/>/g, '\n')

    console.log(res)
    return res ?? ''
  } catch (e) {
    console.error(e)
    return ''
  }
}

const now = new Date()
const utc = now.getTime() + now.getTimezoneOffset()*60*1000
const today = new Date(utc + 9*60*60*1000)

const days = []
for (let i=0; i<5; i++)
  days.push(new Date(today.getTime() + i*24*60*60*1000))

const res_meal = []
for (const d of days)
  res_meal.push(await fetchMeal(d))

const get = o => new Promise((res, rej) => {
  request.get(o, (e, r, b) => {
    if (e) rej(e)
    else {
      try {
        res(JSON.parse(b))
      } catch(e) {
        rej(e)
      }
    }
  })
})

function getEmoji(x) {
  if (x==='0') return '🌤️'
  if (x==='1' || x==='2' || x==='4') return '🌧️'
  if (x==='3') return '🌨️'

  if (x.includes('비') || x.includes('소나기')) return '🌧️'
  if (x.includes('눈')) return '🌨️'
  return '🌤️'
}

const predicts = []
try {
  const resp1 = await get({
    uri: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst',
    qs: {
      ServiceKey: process.env.SERVICEKEY,
      pageNo: 1,
      numOfRows: 1000,
      dataType: 'JSON',
      base_date: formatDate(today),
      base_time: '0500',
      nx: process.env.NX,
      ny: process.env.NY,
    }
  })
  const items = resp1.response.body.items.item
  for (let i=0; i<3; i++)
    predicts.push(
      getEmoji(
        items
          .find(x => x.category === 'PTY' && x.fcstDate === formatDate(days[i]) && x.fcstTime === '0600')
          .fcstValue
      )
    )

  const resp2 = await get({
    uri: 'http://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst',
    qs: {
      serviceKey: process.env.SERVICEKEY,
      numOfRows: 10,
      pageNo: 1,
      dataType: 'JSON',
      regId: process.env.REGID,
      tmFc: formatDate(today) + '0600'
    }
  })
  const items2 = resp2.response.body.items.item[0]
  predicts.push(getEmoji(items2.wf3Am))
  predicts.push(getEmoji(items2.wf4Am))

  console.log(predicts)
} catch (e) {
  console.error(e)
  while (predicts.length < 5) predicts.push('')
}

const template = fs.readFileSync('template.typ').toString()
const context = template
  .replace('$', '(' + JSON.stringify(res_meal).slice(1,-1) + ')')
  .replace('$', '(' + JSON.stringify(predicts).slice(1,-1) + ')')

fs.writeFileSync('main.typ', context)
