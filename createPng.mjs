import pdftopic from 'pdftopic'
import fs from 'fs'

const pdf = fs.readFileSync('main.pdf');
const png = await pdftopic.pdftobuffer(pdf, 0);
fs.writeFileSync(`main.png`, png[0]);
