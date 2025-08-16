`
Author: Erick Roberto Rodriguez Rodriguez
Email: erodriguez@tekium.mx, erickrr.tbd93@gmail.com
GitHub: https://github.com/erickrr-bd/PuppetPDF
PuppetPDF v1.0 - August 2025
`
const fs = require("fs");
const path = require("path");
const yargs = require('yargs');
const puppeteer = require("puppeteer");

const argv = yargs
  .option("input", { alias: 'i', type: "string", demandOption: true })
  .option("output", { alias: 'o', type: "string", demandOption: true })
  .argv;

console.log(`
██████╗ ██╗   ██╗██████╗ ██████╗ ███████╗████████╗██████╗ ██████╗ ███████╗
██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔══██╗██╔══██╗██╔════╝
██████╔╝██║   ██║██████╔╝██████╔╝█████╗     ██║   ██████╔╝██║  ██║█████╗  
██╔═══╝ ██║   ██║██╔═══╝ ██╔═══╝ ██╔══╝     ██║   ██╔═══╝ ██║  ██║██╔══╝  
██║     ╚██████╔╝██║     ██║     ███████╗   ██║   ██║     ██████╔╝██║     
╚═╝      ╚═════╝ ╚═╝     ╚═╝     ╚══════╝   ╚═╝   ╚═╝     ╚═════╝ ╚═╝v1.0
`);
console.log("By Erick Rodriguez\n");
console.log(`[*] Input: ${argv.input}`);
console.log(`[*] Output: ${argv.output}`);

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  const html = fs.readFileSync(argv.input, "utf8");

  await page.setContent(html, { waitUntil: "networkidle0" });
  try{
    await page.pdf({
      path: argv.output,
      format: "A4",
      printBackground: true,
      margin: {  top: "20mm", bottom: "20mm" }
    });
    await browser.close();
    console.log(`\n[*] Created PDF: ${argv.output}`);
  } catch(err){
    console.log("\n[*] Error creating PDF");
    console.log(err.message)
  }
})();