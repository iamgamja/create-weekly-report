const school = require("school.hana.js")

(async () => {
  const sch = await school.search({
    SCHUL_NM: process.SCHOOL_NAME,
  })[0]
    
  const res = school.meal({
    ...sch,
    
  })

  console.log(res)
})
