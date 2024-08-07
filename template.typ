#set text(font: "Pretendard", size: 16pt)
#set page(margin: 30pt)
#show heading: it => [
  #set align(center)
  #set text(32pt)
  #it
]

#let emojiNameDict = (
  "🌤️": image("assets/1f324.png", width: 30pt),
  "🌧️": image("assets/1f327.png", width: 30pt),
  "🌨️": image("assets/1f328.png", width: 30pt),
)

// generated code start
#let meal = $
#let weather = $
// generated code end

#let baseday = datetime(year: 2024, month: 3, day: 4)
#let today = datetime.today(offset: 9)
#let days = range(0, 5).map(i => today + duration(days: i))

#let d = 36
= 이번주 주번: #{(today - baseday).weeks()*2+1 - d},#{(today - baseday).weeks()*2+2 - d}번

#table(
  columns: (auto, 1fr, auto, 1fr),
  align: (x, y) => {
    if (x==0) { center }
    else { auto }
  },
  inset: 10pt,
  ..for i in range(0, 5) {
    (
      str(days.at(i).month()) +
      "/" +
      str(days.at(i).day()) +
      "\n" +
      emojiNameDict.at(weather.at(i)),

      meal.at(i)
    )
  },
)
