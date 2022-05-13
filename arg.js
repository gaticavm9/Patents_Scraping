const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path'); 
const websites = require('./websites.json');
const { fstat } = require('fs');

//const queryText = 'ACN/CL and ISD/1/1/2020->12/31/2021';
const queryText = process.argv[2];

(async () => {

  
    console.log(queryText);
  

})();



  /*for (const website of websites){
    const scripPath = path.join(__dirname,'scripts',website.scriptName);
    require(scripPath)(page, website, queryText);

    console.log('empezando script grab_links');
    require(path.join(__dirname,'scripts','grab_links'))(page, website);
  }*/