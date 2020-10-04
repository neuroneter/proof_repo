
//Importamos los Enumeradores de constantes 
import Enum from "./Enum";

/**
 * Función que consume el servicio que retorna el listado de los productos 
 * @param {*} dispatch Dispatch para la gestión del store
 * @param {*} textFind Valor buscado 
 */
function getProducts(dispatch, textFind){
    apiCall(Enum.routes.UrlItems+textFind, dispatch, "setProducts");
}

/**
 * Funcion que consume el servicio que retorna la información de un producto
 * @param {*} dispatch Dispatch para la gestión del store
 * @param {*} idFind id del producto a buscar 
 */
function getProduct(dispatch, idFind){
    apiCall(Enum.routes.UrlItem+idFind, dispatch, "setProduct");
}

/**
 * Fucion para el llamado a API Rest 
 * @param {*} queryUrl Ruta del EndPoint a consumir
 * @param {*} dispatch Funcion dispatch que se dispara con el resultado retornado por el Api Rest 
 * @param {*} type Indica al dispatch cual es la gestión a realizar dentro del store
 */
function apiCall(queryUrl, dispatch, type){
    fetch(queryUrl)
    .then(data => data.json())
    .then(data => { dispatch({ type, data}) })
    .catch(function (error) {console.log( Enum.error.err1 + error);}); 
}

/**
* Retorna un objeto con las instancias a las funciones del componente DAO
**/
const DAO = { getProducts, getProduct }

export default DAO;