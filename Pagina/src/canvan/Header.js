import React, { Component } from 'react';
import {Row, Col, CardImg, InputGroupAddon, InputGroup, InputGroupText, Input, CardHeader, Container} from 'reactstrap';
import Logo from "../assets/images/Logo_ML.png";
import searchIcon from "../assets/images/ic_Search.png";
import { connect } from 'react-redux';
import DAO from "../components/Dao";
import queryString from 'query-string';

/**
 * Clase del componente que se encarga del buscador
 */
class Header extends Component{

    /**
	 * Constructor
	 */
    constructor(props) {
        super(props);
        //Definimos el estado y cargamos en el, el valor de la busqueda 
        //si no hay valor se asigna un valor en blanco 
        this.state = {
            find:(this.props.match.params.search)?this.props.match.params.search:"",
        };
    }

    //Funcion nativa que es ejecutada automaticamente al cargar el componente 
    //buscamos identificaar si hay una busqueda previa al cargar el componente
    componentDidMount(){
        //Obtenemos la ubicación de la ruta donde nos encontramos esto se realiza ya que este componente
        //es cargado en dos rutas y solo en una el componente al ser llamado realizara un llamado para busqueda
        //automatica 
        var pathname = String(this.props.location.pathname)
        //Si nos encontramos en la ruta /items y se llama este componente realizaremos una llamada Rest automatica
        if(pathname === "/items"){
            //obtenemos el varlo de la busqueda 
            let find = queryString.parse(this.props.location.search);
            //Si este valor existe lo asignamos al state local y llamamos una vez asignado a la funcion que llama
            //al distpatch 
            find = (String(find.search) !== "undefined")?String(find.search):"";
            this.setState({find},() => {
                //llamamos al dispatch primero pasando por el Dao que recupera los datos desde API Rest
                this.callFind();
            });
        }
    }
    
    /**
     * Funcion que es llamada cuando se realiza una acción enter de busqueda o clic en buscar 
     */
    callFind(){
        //Verifica si un Id de Item para enviar a limpiar el objeto store de la ultima consulta de productos 
        //con el fin de evitar visualizar los productos de una busqueda pasada esto por unos segundos 
        if(this.props.match.params.id !== undefined) this.props.clearProducts("cQuery");
        //verificamos si hay un valor cargado de busqueda, se hace por si se recarga o se ingresa 
        //con una url que contenga definida una busqueda 
        var search = (this.state.find !== "")? '?search='+this.state.find:"";
        //Redireccionamos al la ruta que renderiza la información del producto 
        this.props.history.push({
            pathname: '/items',
            search
        })
        //llamamos al distpatch que pasa primero por una llamada al API Rest a travez del DAO 
        this.props.callDispatch(this.state.find);
    }
    
    //Funcion que renderiza el componente
	render(){
        //Definimos los tamaños y posiciones del renderizado 
        const pos = {logo:{size:1, offset:1} , barSerch:{size:9}}
		return(
            <CardHeader className="bg-success">
                <Row>
                    <Col md={pos.logo} className="prodHCol1">
                        <Container fluid={true}>
                            <img src={Logo} className="d-block" alt="Mercadolibre.com" />
                        </Container>
                    </Col>

                    <Col md={pos.barSerch} className="prodHCol2">
                        <Container fluid={true}>
                            <InputGroup>
                                <Input type="text" id="name" placeholder="Nunca dejes de buscar" defaultValue={this.state.find} onChange={(find) => {this.setState({find:find.target.value})}} onKeyDown={(e) => {if (e.key === 'Enter') this.callFind()}}/>
                                    <InputGroupAddon addonType="prepend" onClick={this.callFind.bind(this)}>
                                    <InputGroupText><CardImg width="100%" src={searchIcon}/></InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Container>
                    </Col>
                </Row>
            </CardHeader>
		)
	}
}

//Funcion que conecta al store a travez del reducer 
//obj es cargado a las props y permite acceder a los datos gestionados por el distpacher ReducerSearch -> Rsearch
const mapStateToProps = (state) => {
    return{
        obj:state.ReducerSearch
    }
}
 
//Funcion que instancia la funcion distpatch la cual recibe el valor que le permite al distpache 
//identificar la accion a realizar sobre el store
const mapDispatchToProps = (dispatch) => {
	return {
        callDispatch:(data) => {
            DAO.getProducts(dispatch, data);
        },
        clearProducts:(type) => {
            dispatch({type});
        }
    }
}

//connectamos al redux los metodos instanciados.
export default connect(mapStateToProps, mapDispatchToProps)(Header);