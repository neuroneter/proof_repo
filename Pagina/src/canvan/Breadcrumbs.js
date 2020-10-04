import React, { Component } from 'react';
import {Row, Col, CardBody, Container} from 'reactstrap';
import { connect } from 'react-redux';
import DAO from "../components/Dao";

/**
 * Clase del componente miga de pan
 */
class BreadCrumbs extends Component{

	/**
	 * Constructor
	 */
    constructor(props) {
		super(props);
		this.state = {}
		this.breadCrumb = this.breadCrumb.bind(this);
	}

	/**
	 * Funcion que construye la miga de pan 
	 * @param {*} obj Contiene la información del store que contiene la respuesta de la consulta 
	 */
	breadCrumb(obj){

		//Cargamos las categorias que corresponden a la miga de pan de la ruta cargada
		var categories;
		if(this.props.match.params.id) categories = obj.item.categories;
		else categories = obj.query.categories;
		
		//Verificamos si hay valores retornados para la construcción de las categorias que conforman la miga de pan 
		if(categories && categories.length > 0){
			//Variable con la que concatenamos la miga de paan 
			var breadcrub = "";
			categories.forEach((val, item) => {
				breadcrub += ((categories.length-1) === item)? val.name : val.name+" > ";
			});
			return (
				<div>
					{breadcrub}
				</div>
			)
		}
		return "";
	}
	
	//Funcion que renderiza el componente
	render(){
		//Definimos los tamaños y posiciones del renderizado 
		const pos = {breadcrumb:{size:10, offset:1}}
		return(
			<CardBody>
				<Row>
					<Col xs={pos.breadcrumb} sm={pos.breadcrumb} md={pos.breadcrumb} className="BreadCol">
						<Container fluid={true}>
							{this.breadCrumb(this.props.obj)}
						</Container>
					</Col>
				</Row>
			</CardBody>
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
        }
    }
} 

//connectamos al redux los metodos instanciados.
export default connect(mapStateToProps, mapDispatchToProps)(BreadCrumbs);