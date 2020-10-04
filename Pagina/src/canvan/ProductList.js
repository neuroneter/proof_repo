import React, { Component } from 'react';
import {CardBody, CardImg,Row, Col, Container} from 'reactstrap';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer'
import Shipping from "../assets/images/ic_shipping.png";
import CurrencyFormat from 'react-currency-format';
import { connect } from 'react-redux';

/**
 * Clase del componente ProductList 
 * Encargada de gestional la visiualización del listado de productos 
 */
class ProductList extends Component{

	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		//Asignamos la funcion CardProduct con el contexto de la clase 
		this.cardProduct = this.cardProduct.bind(this);
	}
	
	/**
	 * Funcion que es llamada para redireccionar a la ruta que carga el componente de
	 * descripción del producto
	 * @param {*} id El id del producto con el cual se podra cosumir la informacion del producto
	 */
	productCall(id){
		//Llamamos al distpach que limpia objeto del store que tiene información del producto
		//Eso se realiza para evitar que se muestre por unos segundos la información de un producto
		//de un producto anteriormente cargado
		this.props.clearProducts("cItem");
		//Redireccionamos a la ruta /items/ con el id del producto 
		this.props.history.push({pathname: '/items/'+id});
	}

	/**
	 * Funcion que construye dinamicamente cada uno de los productos de la busqueda 
	 * esta es llamada cada vez que el objeto del store es modificado con un uno listado de productos
	 * @param {*} obj Objeto del store
	 */
	cardProduct(obj){
		//Definimos un objeto para concatenar los productos 
		var products = [];
		//Asignamos instancia a la funcion que redirecciona a la pagina de producto, esto con el contexto de la clase
		const productCall = this.productCall.bind(this);
		//Verificamos si hay productos en el objeto actualizado del store
		if(obj.query.items && obj.query.items.length > 0){
			//Asignamos el contenido de los items retornados 
			const result = obj.query.items;
			//Definimos los tamaños y posiciones que se utlizaran en la maquetación 
			const pos = {img:{size:2, offset:1} , state:{size:2}, desc:{size:6}, line:{size:10, offset:1}}
			//Definimos variables que seran utilizadas y recalculadas en cada uno de los items 
			var price;
			var freeShipping;
			//Recorremos todos los items de productos retornados
			result.forEach(val => {
				//Calculamos el precio redondeando este evitando decimales 
				price = Math.round(val.price.amount, -1);
				//En la variable cargamos la imagen de freeshipping si esta es verdadera
				freeShipping = (val.free_shipping)?(<div className="shipping"><CardImg width='100%' src={Shipping}/></div>):"";
				//Asignamos al objeto el item con los valores del store
				products.push(
					<div key={val.id}>
						<Row>
							<Col md={pos.img} className="prodLCol1">
								<Container fluid={true}>
									<img src={val.picture} className="mx-auto d-block" alt={val.title} onClick={() => productCall(val.id)}/>
								</Container>
							</Col>
							<Col md={pos.desc} className="prodLCol2">
								<Container fluid={true}>
									<div className="price" onClick={() => productCall(val.id)}>
										<CurrencyFormat value={price} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={'$ '} renderText={value => value} /> 
										{freeShipping}
									</div>
									<div className="info">
										<div className="title">{val.title}</div>
										<div className="condition">{val.condition}</div>
									</div>
								</Container>
							</Col>
							<Col md={pos.state} className="prodLCol3">
								<Container fluid={true}>
									<div className="state">{val.state}</div>
								</Container>
							</Col>
						</Row>
						<Row>
							<Col md={pos.line}>
								<Container fluid={true} className="bg-white">
									<div className="line"></div>
								</Container>
							</Col>
						</Row>
					</div>
				);
			});
		}else{
			//Si no hay items retornados en la consulta cargamos un contenedor por defecto en blanco
			products.push(
				<Row key="0" className="prodNull">
					<Col className="h-100 d-table no-gutter"></Col>
				</Row>
			);
		}
		//Retornamos todos los productos concatenados 
		return products;
	}

	//Renderizamos el resultado del componente, este componente consume los siguientes compoentes externos
	//Header: Compoente que se encarga del buscargdor, pasamos los props ya que seran utilizados 
	//BreadCrumbs: Se encarga de la miga de pan aunque en este test se visializa un dumy 
	//Footer: Componente que se encarga del pie de la pagina 
	//Para renderizar los productos utilizamos la llamada a la funcion cardProduct la cual esta definida en el
	//constructor con el contexto, esta al tener la referencia al objeto store hara que cada vez que se actualiza
	//el store dispare la llamada al metodo, generando un nuevo renderizado. 
	render(){
		return(
                <Container fluid={true} className="p-0 bg-light">
					<Header {...this.props}/>
                    <Breadcrumbs {...this.props}/>
					<CardBody>
						{this.cardProduct(this.props.obj)}
					</CardBody>
                    <Footer/>
                </Container>
		)	
	}
}

//Funcion que conecta al store a travez del reducer 
//obj es cargado a las props y permite acceder a los datos gestionados por el distpacher ReducerSearch -> Rsearch
const mapStateToProps = (state) => {
    return{
        obj:state.ReducerSearch,
    }
}

//Funcion que instancia la funcion distpatch la cual recibe el valor que le permite al distpache 
//identificar la accion a realizar sobre el store
const mapDispatchToProps = (dispatch) => {
	return {
        clearProducts:(type) => {
            dispatch({type});
        }
    }
}

//connectamos al redux los metodos instanciados.
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);