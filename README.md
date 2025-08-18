# PuppetPDF
PuppetPDF is a blazing-fast Node.js CLI tool that converts HTML files into pixel-perfect PDFs using [Puppeteer](https://pptr.dev/).  
Built for developers, sysadmins, and automation workflows that demand precision, style fidelity, and full control over output.

## Features
- Converts HTML to PDF with full CSS and image support.
- Preserves colors, layout, and print styles.
- Optimized for enterprise reports and multi-table documents.
- CLI-ready with argument parsing.
- Option to automatically open the generated PDF.
- Works headlessly with Puppeteer and Chromium.

## Installation

Clone the repo and install dependencies:

```
git clone https://github.com/erickrr-bd/PuppetPDF.git
cd PuppetPDF
npm install
```
## Requirements
- Node.js ≥ 18
- Internet access (if your HTML loads remote resources)
- Chromium (bundled with Puppeteer)

## Usage
```
usage: node PuppetPDF.js [--input] [--output] [--size] [--open]

optional arguments:
  --input       Path to the HTML file
  --output      Path to save the generated PDF
  --size        PDF size (A4. Letter, Legal)
  --open        Automatically open the generated PDF (optional)
```

It's also possible to obtain the list of arguments using the help option.

```
usage: node PuppetPDF.js [--help]
```

## Example
```
node PuppetPDF.js --input 172.24.40.4.html --output 172.24.40.4.pdf --size A4
```
HTML document with styles, colors and images.

![Preview](./images/img1.png)

Using the PuppetPDF tool, the HTML document is converted into PDF.

![Preview](./images/img2.png)

The PDF document is generated, maintaining the styles, colors and images of the original HTML document.

![Preview](./images/img3.png)
