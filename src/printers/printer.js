const fs = require("fs");
const pdf = require("html-pdf");
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

function loadCSSFromFile(filePath) {
    // Read the CSS file content
    let finalPath = path.resolve(filePath);
    const css = fs.readFileSync(finalPath, 'utf-8');
    return css;
  }



async function downloadStyles(html) {
    const $ = cheerio.load(html);
  
    // Find all <link> elements with a "href" attribute and "rel" attribute set to "stylesheet"
    const stylesheetLinks = $('link[rel="stylesheet"][href]');
  
    // Create an array to store the CSS content
    const css = [];
  
    // Loop through each stylesheet link and download the CSS content
    for (let i = 0; i < stylesheetLinks.length; i++) {
      let link = stylesheetLinks[i];
      let href = $(link).attr('href');

      if (!/^(https?:\/\/)/i.test(href) && !/^(\/\/)/i.test(href)) {
        href = 'https://psnprofiles.com/' + href;
      }

      
  
      // Download the CSS content
      const response = await axios.get(href);

      if(href.includes('psnprofiles.css')){
        //mod
        //htmlContent
        // min-width: 1070px;
        css.push(loadCSSFromFile('./src/printers/psnprofiles.css'))
      }else{
        css.push(response.data);
      }

    }  
    return css;
  }


async function fixOrphanStyles(html) {
    const $ = cheerio.load(html);
  
    // Find all <link> elements with a "href" attribute and "rel" attribute set to "stylesheet"
    const stylesheetLinks = $('link[rel="stylesheet"][href]');

  
    // Loop through each stylesheet link and modify html to fix css url
    for (let i = 0; i < stylesheetLinks.length; i++) {
      let link = stylesheetLinks[i];
      let href = $(link).attr('href');

      if (!/^(https?:\/\/)/i.test(href) && !/^(\/\/)/i.test(href)) {
        href = 'https://psnprofiles.com/' + href;
        $(link).attr('href', href);
        console.log('Updated css: ' + $(link).attr('href'));
      }
    }  
    //return updated html content
    return html;
  }

async function printAsPdf(htmlContent) {
    let styles = await downloadStyles(htmlContent);

    
    let styleElements = '';
    for (let i = 0; i < styles.length; i++) {
      styleElements += `<style>${styles[i]}</style>`;
    }
    
    htmlContent = htmlContent.replace('</head>', `${styleElements}</head>`);

    const SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
      let cleanHtml = htmlContent;
      while (SCRIPT_REGEX.test(cleanHtml)) {
        cleanHtml = cleanHtml.replace(SCRIPT_REGEX, "");
      }


    return new Promise((resolve, reject) => {
        const path = "./guide.pdf";
        pdf
          .create(cleanHtml, {
            format: 'A4',
            childProcessOptions: {
                env: {
                  OPENSSL_CONF: '/dev/null',
                },
              }
          })
          .toFile(path, function (err, res) {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve({ path: res.filename });
            }
          });
    });
}

module.exports = {
    printAsPdf: printAsPdf
};