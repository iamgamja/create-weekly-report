import * as school from "school.hana.js"

const sch = await school.search({
  SCHUL_NM: process.SCHOOL_NAME,
})[0]
    
const res = school.meal({
  ...sch,
  
})

console.log(res)
