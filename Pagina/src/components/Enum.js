//Listado de constantes

/** 
 * Objeto de rutas para consultar los proudctos 
 * @param {*} UrlItems Ruta que retorna un conjunto de productos 
 * @param {*} UrlItem Ruta que retorna la información de un producto 
 */

const routes = {
    UrlItems : "http://localhost:5567/api/items?q=",
    UrlItem : "http://localhost:5567/api/items/"
};

/** 
 * Objeto de errores que se pueden generar durante el consumo de la apliación
 * @param {*} err1 Ruta que retorna un conjunto de productos 
 */
const error = {
  err1: " El EndPoint no se encuentra activo "
}
 
/**
* Objeto con las instancias a los objetos del Enumerador
**/
const Enum = {routes, error};
  
export default Enum;