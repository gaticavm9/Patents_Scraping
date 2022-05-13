module.exports = async (page, website, queryText) => {
/////////////////////////////// Search ///////////////////////////////
    const { selectors } = website;
    await page.goto(website.url);
    await page.waitForSelector(selectors.textField1);
    //Pasar los parametros de busqueda
    await page.select(selectors.textField1, selectors.titleField)
    await page.type("div[id='text1'] > input", "ice cream");
    await page.waitForTimeout(5000);
    await page.click("#btnAdd");
    await page.select(selectors.textField2, selectors.ownerField);
    await page.type("div[id='text2'] > input", "");
    await page.waitForTimeout(5000);
    await page.select(selectors.countryField, "");
    await page.waitForTimeout(5000);
    await page.select(selectors.dateField, selectors.dateFieldType)
    await page.type(selectors.fromDateField, "01-01-2018");
    await page.type(selectors.toDateField, "01-01-2021");
    await page.waitForTimeout(3000);

    //Click en botón de busqueda y se espera hasta que cargue resultados
    await page.click(selectors.searchButton);
    await page.waitForTimeout(10500);



/*
    /////////////////////////////// Grab Links ///////////////////////////////
    await page.waitForSelector(selectors.primeraPatente);
    await page.waitForTimeout(1500);

    //Cantidad de patentes encontradas
    var cantidad_patentes = await page.evaluate((cantidadPatentes) => {
        var temp2 = document.querySelector(cantidadPatentes).innerText;
        return temp2;
    }, selectors.cantidadPatentes);


    //Obtener enlaces de las patentes de primera lista (50)
    var enlacesT = []; 
    var enlaces = await page.evaluate((patentes) => {
    const elementos = document.querySelectorAll(patentes);
    var links= [];
    for (let element of elementos) {
        links.push(element.href);
    }
    return links;
    }, selectors.patentes);
    //Guardar enlaces de la pagina en enlacesT
    enlaces.forEach(function(value){ enlacesT.push(value); });


    //Recoger enlaces de las siguientes listas
    if(cantidad_patentes>50){
        for(var i=1; i<(cantidad_patentes/50); i++){

            await page.click('input[name="NextList'+ (i+1) +'"]');
            await page.waitForSelector(selectors.primeraPatente);
            await page.waitForTimeout(1500);
    
            var enlaces = await page.evaluate((patentes) => {
                const elementos = document.querySelectorAll(patentes);
                var links= [];
                for (let element of elementos) {
                links.push(element.href);
                }
                return links;
            }, selectors.patentes);
            //Guardar enlaces de la pagina en enlacesT
            enlaces.forEach(function(value){ enlacesT.push(value); });
        
        }
    }
    await console.log('cantidad de enlaces', enlacesT.length);

/////////////////////////////// Grab Info ///////////////////////////////    
    await console.log('empezando script grab_info');
    //Recorrer enlaces de patentes y recoger informacion
    const libros = [];
    for(var i=0; i<cantidad_patentes; i++){
    await page.goto(enlacesT[i]);
    await page.waitForSelector(selectors.title);

    const libro = await page.evaluate((selectors) => {
        const tmp = {};
        tmp.origin = document.querySelector(selectors.origin).innerText;
        tmp.origin = tmp.origin.split("\n").join(""); //Eliminar salto de linea \n
        tmp.assignee = document.querySelector(selectors.assignee).innerText;
        tmp.nroAppl = document.querySelector(selectors.nroAppl).innerText;
        tmp.nroPatente = document.querySelector(selectors.nroPatente).innerText;
        tmp.title = document.querySelector(selectors.title).innerText;
        tmp.abstract = document.querySelector(selectors.abstract).innerText;
        
        return tmp;
    }, selectors);
    libros.push(libro);      
    }

    return Promise.resolve(libros);
*/

};