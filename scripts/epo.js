module.exports = async (page, website, queryText) => {
/////////////////////////////// Search ///////////////////////////////
    const { selectors } = website;
    await page.goto(website.url);
    await page.waitForSelector(selectors.queryArea);
    //Pasar los parametros de busqueda
    await page.type(selectors.queryArea, queryText);
    //Click en botón de busqueda y se espera hasta que cargue resultados
    await page.click(selectors.searchButton);

/////////////////////////////// Grab Links ///////////////////////////////
    await page.waitForSelector(selectors.primeraPatente);
    await page.waitForTimeout(1500);

    //Cantidad de patentes encontradas
    var cantidad_patentes = await page.evaluate((cantidadPatentes) => {
        var temp2 = document.querySelector(cantidadPatentes).innerText;
        return temp2;
    }, selectors.cantidadPatentes);
    cantidad_patentes = cantidad_patentes.split(" ");
    cantidad_patentes = parseInt(cantidad_patentes, 10);

    //Obtener info de las patentes
    await console.log('empezando script grab_info');
    const libros = [];
    var aux=1;
    for(var i=1; i<cantidad_patentes+1; i++){

        const libro = await page.evaluate((aux) => {
            const tmp = {};
            tmp.title = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+((aux*2)-1)+') > th > a').innerText;
            tmp.representative = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+(aux*2)+') > td:nth-child(5)').innerText;
            tmp.representative = tmp.representative.split("\n")[1]; //Eliminar el resto del innerText
            tmp.applicant = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+(aux*2)+') > td:nth-child(4)').innerText;
            tmp.applicant = tmp.applicant.split("\n")[1]; //Eliminar el resto del innerText
            tmp.nroAppl = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+(aux*2)+') > td:nth-child(2)').innerText;
            tmp.nroAppl = tmp.nroAppl.split("\n")[1]; //Eliminar el resto del innerText
            tmp.nroPatente = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+(aux*2)+') > td:nth-child(3)').innerText;
            tmp.nroPatente = tmp.nroPatente.split("\n")[1]; //Eliminar el resto del innerText
            tmp.link = document.querySelector('#body > div.modSearchResult > div.blockMe > table > tbody > tr:nth-child('+((aux*2)-1)+') > th > a').href;
            //tmp.abstract = document.querySelector(selectors.abstract).innerText;

            return tmp;
        }, aux);
        libros.push(libro);   
        
        //Epo muestra 20 patentes por pagina. Se registra la patente 20 de la pagina y se avanza a la siguiente.
        if (i%20 == 0) {
            await page.click(selectors.nextPage);
            await page.waitForSelector(selectors.primeraPatente);
            await page.waitForTimeout(1500);
            aux=0;
        }
        aux=aux+1;    
    }

    await console.log('cantidad de patentes', libros.length);
 

    //Devolver libros con la info
    return Promise.resolve(libros);


};