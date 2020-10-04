/**
* Objeto modelo para estructurar el store 
* @param {*} query Objeto para almacenar todos los productos de una consulta 
* @param {*} item Datos de un producto consultado 
*/
const objQuery = {query:[], item:[]}

/**
 * Función que hace parte del dispatcher y gestiona el store para los objetos query y item 
 * @param {*} state Estado del store para ser mutado 
 * @param {*} action Objeto con la información de gestión 
 */
function RSearch(state = objQuery, action){
    //Creamos una copia del store 
    var NewState = Object.assign({},state);
    //Seteamos en la copia del store los datos que son enviados en el action 
    if(action.type === "setProducts") NewState.query = action.data;
    if(action.type === "setProduct") NewState.item = action.data;
    //Limpiamos el contenido del store para evitar carga de información rapida que no 
    //corresponda a la consultada dado el proceso asyncrono de API Rest
    if(action.type === "cQuery")  NewState.query = [];
    if(action.type === "cItem") NewState.item = [];

    //Retornamos la copia del estado para mutarl la store 
    return NewState;
}

/**
* Objeto con las instancias de las funciones del Modulo RSearcho instancia del distpacher
**/
const ReducerSearch = {RSearch}

export default ReducerSearch;