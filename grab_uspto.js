const puppeteer = require('puppeteer');

(async() => {
  const browser = await puppeteer.launch({headless: false});
  const queryText = 'ACN/CL and ISD/1/1/2020->12/31/2021';
  try {
    const page = await browser.newPage();
    //Para que la pagina no reconozca que es un HeadlessChrome
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    //Acceder a la web de USPTO y esperar que cargue
    await page.goto('http://patft.uspto.gov/netahtml/PTO/search-adv.htm');
    await page.waitForSelector('#mytextarea');

    //Pasar los parametros de busqueda, en este caso de forma manual "ACN/CL and ISD/1/1/2020->12/31/2021" para listar patentes de Chile desde el 2020 a la fecha
    await page.type('#mytextarea', queryText);
    await page.screenshot({path: 'uspto2.jpg'});
    //Click en botón de busqueda y se espera hasta que cargue resultados
    await page.click('input[value=Search]');
    await page.waitForSelector('[valign="top"] [href]');
    await page.screenshot({path: 'uspto3.jpg'});
    //Esperar 1.5seg para asegurar que carguen todos los elementos
    await page.waitForTimeout(1500);
    //Obtener link de primera patente y cantidad de patentes encontradas
    var cantPatentes = await page.evaluate(() => {
      var temp2 = document.querySelector('i strong:nth-of-type(3)').innerText;
      return temp2;
    });
    //revisar que reconoce cant de patentes
    console.log(cantPatentes)

    //Obtener enlaces de las patentes de primera lista (50)
    var enlacesT = []; 
    var enlaces = await page.evaluate(() => {
      const elementos = document.querySelectorAll('tr td[valign="top"]:nth-of-type(2) a');
      var links= [];
      for (let element of elementos) {
        links.push(element.href);
      }
      return links;
    });
    //Guardar enlaces de la pagina en enlacesT
    enlaces.forEach(function(value){ enlacesT.push(value); });

    //revisar que reconoce los 50 enlaces
    console.log(enlacesT.length);

    //Recoger enlaces de las siguientes listas
    for(var i=1; i<(cantPatentes/50); i++){

      await page.click('input[name="NextList'+ (i+1) +'"]');
      await page.waitForSelector('[valign="top"] [href]');
      await page.waitForTimeout(1500);

        var enlaces = await page.evaluate(() => {
          const elementos = document.querySelectorAll('tr td[valign="top"]:nth-of-type(2) a');
          var links= [];
          for (let element of elementos) {
            links.push(element.href);
          }
          return links;
        });
        //Guardar enlaces de la pagina en enlacesT
        enlaces.forEach(function(value){ enlacesT.push(value); });
    
    }
    //revisar que reconoce todos los enlaces
    console.log(enlacesT.length);

    //Recorrer enlaces de patentes y recoger informacion
    const libros = [];
    for(var i=0; i<cantPatentes; i++){
      await page.goto(enlacesT[i]);
      await page.waitForSelector('font[size="+1"]');

      const libro = await page.evaluate(() => {
        const tmp = {};
        tmp.origen = document.querySelector('tbody tr:nth-child(2) td[align="left"][width="90%"] td:nth-child(4):not(br)').innerText;
        tmp.assignee = document.querySelector('tbody tr:nth-child(3) td[align="left"][width="90%"] b:nth-child(1)').innerText;
        tmp.nroAppl = document.querySelector('tbody tr:nth-child(5) td[align="left"][width="90%"] b:nth-child(1)').innerText;
        tmp.nroP = document.querySelector('tbody tr:nth-child(1) td[align="right"][width="50%"] b').innerText;
        tmp.title = document.querySelector('font[size="+1"]').innerText;
        tmp.abstract = document.querySelector('body p:nth-of-type(1)').innerText;
        
          

        return tmp;
      });
      libros.push(libro);      
    }

    console.log(libros);


  //Captura de errores  
  } catch (err) {
    console.error(err.message);
  } finally {
    await browser.close();
  }
})();

