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
const { exec } = require('child_process');
const { execSync } = require('child_process');

const argv = yargs
.option("input", { alias: 'i', describe : "Path to the HTML file", type: "string", demandOption: true })
.option("output", { alias: 'o', describe : "Path to save the generated PDF", type: "string", demandOption: true })
.option("size", { alias: 's', describe : "PDF size", choices : ["A4", "Letter", "Legal"], type: "string", demandOption: true })
.option("open", { describe : "Automatically open the generated PDF", type: "boolean", default : false })
.argv;

/**
 * Validates whether a PDF viewer is available on the system.
 *
 * @returns {boolean} - Whether or not there is a PDF viewer.
 * 
 * @throws {Error} If there is an error when validating whether a PDF viewer is available.
 */
function validate_pdf_visor(){
  const platform = process.platform;

  try{
    if(platform == "win32"){
      execSync("where start", { stdio : "ignore" });
    }
    else if(platform == "darwin"){
     execSync("which open", { stdio : "ignore" });
    }
    else if(platform == "linux"){
      execSync("which xdg-open", { stdio : "ignore" });
    }
    else{
      return false;
    }
    return true;
  } catch{
    return false;
  }
}

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
console.log(`[*] Size: ${argv.size}`);

(async () => {
  const ext_input = path.extname(argv.input).toLowerCase();
  const ext_output = path.extname(argv.output).toLowerCase();

  if(!fs.existsSync(argv.input) || (ext_input !== ".html" && ext_input !== ".htm")){
    console.error("\n[*] File doesn't exist or isn't an HTML document");
  }
  else if(ext_output !== ".pdf"){
    console.error("\n[*] Output file must be a PDF file");
  }
  else{
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const html = fs.readFileSync(argv.input, "utf8");
    await page.setContent(html, { waitUntil: "networkidle0" });
    try{
      await page.pdf({
        path: argv.output,
        format: argv.size,
        printBackground: true,
        margin: {  top: "20mm", bottom: "20mm" }
      });
      await browser.close();
      console.log(`\n[*] Created PDF: ${argv.output}`);
      if(argv.open){
        if(validate_pdf_visor()){
          const platform = process.platform;
          const pdf_path = path.resolve(argv.output);

          console.log("[*] Opening PDF file: ", pdf_path);
          if(platform == "win32"){
            exec(`start "" "${pdf_path}"`, (error) => {
              if(error){
                console.error("Error opening PDF: ", error.message);
              }
            });
          }
          else if(platform == "darwin"){
            exec(`open "${pdf_path}"`, (error) => {
              if(error){
                console.error("Error opening PDF: ", error.message);
              }
            });
          }
          else if(platform == "linux"){
            exec(`xdg-open "${pdf_path}"`, (error) => {
              if(error){
                console.error("Error opening PDF: ", error.message);
              }
            });
          }
          else{
            console.error("[*] Couldn't open automatically: system not recognized");
          }
        }
        else{
          console.warn("[*] No PDF viewer available on this system was detected.");
        }
      }
    } catch(error){
      console.error("\n[*] Error creating PDF: ", error.message);
    }
  }
})();