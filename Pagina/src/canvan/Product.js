import React, { Component } from 'react';
import {CardBody, Button, Row, Col, Container} from 'reactstrap';
import { connect } from 'react-redux';
import DAO from "../components/Dao";
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer'
import parse from 'html-react-parser';
import CurrencyFormat from 'react-currency-format';

/**
 * Clase del componente Product
 * Encargada de gestionar la visiualización de información del producto 
 */
class Product extends Component{

    /**
	 * Constructor
	 */
	constructor(props) {
        super(props);
        //Asignamos la funcion CardProduct con el contexto de la clase 
        this.cardProduct = this.cardProduct.bind();

        //realizamos un llamado inicial a la funcion callDispatch del dispatch para recuperar la información 
        this.props.callDispatch(this.props.match.params.id);
    }

    /**
	 * Funcion que construye dinamicamente el productos de la busqueda 
	 * esta es llamada cada vez que el objeto del store es modificado con la información del producto 
	 * @param {*} obj Objeto del store
	 */
    cardProduct(obj){
        //Cargamos del objeto la información del Item (producto) retornado
        var item = obj.item;
        //Verificamos que exista información retornada para este producto
        if(item){
            //Redondeamos el precio para no tener decimales 
            var price = Math.round(item.price.amount, -1);
            //Definimos los tamaños de cada parte 
            const pos = {img:{size:7, offset:1} , price:{size:3}, desc:{size:10, offset:1}}
            //Una vez maquetada la información retornamos la información para ser renderizada
            return (
                <div>
                    <Row>
                        <Col md={pos.img} className="prodCol1">
                            <Container fluid={true}>
                                <img src={item.picture} className="mx-auto d-block" alt={item.titles}/>
                            </Container>
                        </Col>
                        <Col md={pos.price} className="prodCol2" >
                            <Container fluid={true}>
                                <Row>
                                    <Col className="condition text-dark">
                                        {item.condition} - {item.sold_quantity} Vendidos
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="title text-dark">
                                        {item.title}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="price text-dark">
                                        <CurrencyFormat value={price} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={'$ '} renderText={value => value} />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="button">
                                        <Button block color="primary">Comprar</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={pos.desc} className="prodCol3" >
                            <Container fluid={true}>
                                <Row>
                                    <Col className="title">
                                        Descripción del producto
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="content">
                                        {parse(item.description)}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </div>
            )
        }
    }

    //Metodo del compoente que renderiza la salida este componente consume los siguientes compoentes externos
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
        obj:state.ReducerSearch.item,
    }
}

//Funcion que instancia la funcion distpatch la cual recibe el valor que le permite al distpache 
//identificar la accion a realizar sobre el store
const mapDispatchToProps = (dispatch) => {
	return {
        callDispatch:(data) => {
            DAO.getProduct(dispatch, data);
        }
    }
}

//connectamos al redux los metodos instanciados.
export default connect(mapStateToProps, mapDispatchToProps)(Product);