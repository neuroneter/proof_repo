const express = require('express')
const router = express.Router();
var Request = require("request");
const search = "https://api.mercadolibre.com/sites/MLA/search?q=";
const items = "https://api.mercadolibre.com/items/";
const categ = "https://api.mercadolibre.com/sites/MLA/search?category=";
const iDescription = "/description";


router.get('/items/all', (req, res) => {
    Request.get(search+req.query.q, (error, response, body) => {
        res.status(201).send(body);
    });
})

//Ruta que escuchla las solicitudes por get que llegan por la ruta /api/items/:id
//capturamos a travez de la url el ID 
router.get('/items/:id', (req, res) => {
    //Creamos un objeto que nos permitara construir la respuesta 
    var objResponse = {};
    //Construimos un objeto que sera cargado en el objeto de respuesta y que contiene la informacion del precio
    var price = {};
    //Definimos variable para calcular el numero de digitos decimales de un precio 
    var decimals;
    //Creamos el primer nodo del objeto de respuesta 
    objResponse["author"] = {name:"Daniel Obed",lastname:"Ortega"};
    //Realizamos llamada para consumir el API Rest 
    Request.get(items+req.params.id, (error, response, body) => {

         //Si hay un error en la respuesta de la consulta GET API REST respondemos con el codigo 401
         if(error) { res.status(401).send(error);}

        //Cargamos en la variable obj la respuesta que llega en el cuerpo del request y la parseamos a JSON 
        var obj = JSON.parse(body);
        //Hacmos un calculo para determinar  el numero de decimales que existe
        decimals = obj.price+"";
        decimals = (decimals.split(".")[1] != undefined)? decimals.length:0;
        //Nuevamente realizamos una llamada Get para obtener la descripción del producto utilizando el id del request de 
        //la primera consulta 
        Request.get(items+req.params.id+iDescription, (error, response, body) => {
            //cargamos la respuesta del cuerpo en la variable objDesc
            var objDesc = JSON.parse(body);
            //Definimos el subojeto de precio 
            price = {currency:obj.currency_id, amount:obj.price, decimals:decimals}
            //Ahora construimos el objeto de respuesta 
            objResponse["item"] = {
                id:obj.id, 
                title:obj.title, 
                price, 
                picture:obj.pictures[0].secure_url, 
                condition:obj.condition, 
                free_shipping:obj.shipping.free_shipping,
                sold_quantity:obj.sold_quantity,
                description:objDesc.plain_text,
            }

            Request.get(categ+obj.category_id, (error, response, body) => {
                //Si hay un error en la respuesta de la consulta GET API REST respondemos con el codigo 401
                if(error) { res.status(401).send(error);}
                var objCat = JSON.parse(body);
                
                objResponse["categories"] = breadcrub(objCat.filters);
                //Como la respuesta sera ok respondemos con el codigo 201 y enviamos el objeto de respusta 
                //utilizando el responce del llamado que se encuentra abirta 
                res.status(201).send(objResponse);
            })
        });
    });
});

//Ruta que escuchla las solicitudes por get que llegan por la ruta /api/items
router.get('/items', (req, res) => {
    //Realizamos una llagada GET con la inforación que llega como parametro get 
    //lo recuperamos con el objeto request y que tiene el nombre 'q'
    Request.get(search+req.query.q, (error, response, body) => {

        //Si hay un error en la respuesta de la consulta GET API REST respondemos con el codigo 401
        if(error) { res.status(401).send(error);}

        //creamos una variable de iteracción 
        var i=0;
        // creamos el objeto que guardara los datos de respuesta
        var objResponse = {};

        //Objeto arra para almacenar todos los item retornados del llamado GET al API Rest
        var items =  [];
        //Construimos el nodo author para la respuesta
        objResponse["author"] = {name:"Daniel Obed",lastname:"Ortega"};
        objResponse["categories"] = [];

        //Parseamos la respuesta del llamado GET al API Rest
        var obj = JSON.parse(body);
        
        //Objeto de categorias miga de pan de la busqueda 
        objResponse["categories"] = breadcrub(obj.filters);

        //definimos una variable para calcular el numero de decimales que hay en cada precio 
        var decimals;
        //definimos una variable para almacenar temporalmente el estado de cada producto
        var condition;
        //recorremos todos los items de productos retornados
        obj.results.forEach(element => {
            //Definimos inicialmente la condicion en blanco 
            condition = "";
            //calculamos los decimales
            decimals = element.price+"";
            decimals = (decimals.split(".")[1] != undefined)? decimals.length:0;
            //Recorremos todos los nodos de los atribustos buscando el nodo ITEM Condition
            for(i = 0; i<element.attributes.length; i++){
                //Si encontramos el nodo ITEM_CONDITION ingresamos 
                if(element.attributes[i].id == "ITEM_CONDITION"){
                    //Cargamos el valor de la condicion
                    condition = element.attributes[i].value_name;
                    //Como ya encontramos el nodo rompemos el ciclo 
                    break;
                }
            }
            //Carcamos el item con los valores encontrados 
            items.push({
                id:element.id,
                title:element.title,
                price:{
                    currency:element.currency_id,
                    amount:element.price,
                    decimals
                },
                picture:element.thumbnail,
                condition,
                free_shipping:element.shipping.free_shipping,
                state:element.address.state_name
            });
        });

        //Hacemos los mismo para ITEMS
        objResponse["items"] = items;

        //Si se requiere consultar el API Rest para identificar el breadcrubs de la busqueda 
        if(objResponse["categories"].length == 0){

            //Si no existe el filtro categorias en la respuesta buscamos la categoria mas consultada para construir la miga de pan 
            var bestCategory = "";
            var resultTmp = 0;
            //Recorremos todos los filtros del objeto retornado buscando el nodo que contiene las categorias
            for(i=0; i<obj.available_filters.length; i++){
                //Si encontramos este nodo ingresamos para recorrerlo
                if(obj.available_filters[i].id == 'category'){
                    //Una vez lo podemos recorrer cargamos solo el nombre de las categorias 
                    obj.available_filters[i].values.forEach(categories => {
                        if(categories.results > resultTmp){
                            resultTmp = categories.results;
                            bestCategory = categories.id;
                        } 
                        //catArray.push(categories.name);
                    });
                    //Paramos el ciclo ya que solo nos interesa el nodo categoria
                    break;
                }
            }

            Request.get(categ+bestCategory, (error, response, body) => {
                //Si hay un error en la respuesta de la consulta GET API REST respondemos con el codigo 401
                if(error) { res.status(401).send(error);}
                //Parseamos la respuesta del llamado GET al API Rest
                var objCat = JSON.parse(body);

                //Nodo que contiene las categorias que conforman la miga de pan de la busqueda 
                objResponse["categories"] = breadcrub(objCat.filters);

                //En caso de no existir error podemo responder con el codigo 201 y el objeto construido de la respuesta 
                res.status(201).send(objResponse);
            })
        }else{
            //En caso de no existir error podemo responder con el codigo 201 y el objeto construido de la respuesta 
            res.status(201).send(objResponse);
        }
    });
})

/**
 * Funcion que recibe un objeto de filtros para buscar el de categorias y retornar el path_root que tiene la busqueda
 * @param {*} obj Objeto de filtos que contiene uno con las categorias que conforman la miga de pan de la busqueda 
 */
function breadcrub(obj){
    for(i=0; i<obj.length; i++){
        if(obj[i].id == 'category'){
            return obj[i].values[0].path_from_root;
        }
    }
    return [];
}

//Exportamos el modulo 
module.exports = router