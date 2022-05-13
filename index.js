const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); 
const websites = require('./websites.json');
const { fstat } = require('fs');

const siteScrapper = process.argv[2];
const queryText = process.argv[3]; console.log(queryText);
var site;

switch(siteScrapper){
  case "uspto":           //Ejemplo: node index uspto "ACN/CL and ISD/1/1/2020->12/31/2021"
    site = 0;
    break;
  case "epo":             //Ejemplo: node index epo "ti=ice and ti=cream 2018:2021"
    site = 1;
    break;
  case "canada":
    site = 2;
    break;    
  case "australia":
    site = 3;
    break;     
}

(async () => {
  
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  //Para que la pagina no reconozca que es un HeadlessChrome
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');

  const scripPath = path.join(__dirname,'scripts',websites[site].scriptName);
  const libros = await require(scripPath)(page, websites[site], queryText);
  //Guardar info en archivo .JSON
  await fs.writeFileSync(
                          path.join(__dirname, `${websites[site].scriptName}.json`),
                          JSON.stringify(libros),
                          'utf8'
                        );  

  await browser.close();   
  await console.log('script', websites[site].name, 'listo');

  
})();