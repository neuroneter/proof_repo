import React, { Component } from 'react';
import {Col, CardBody} from 'reactstrap';

/**
 * Clase del componente pie de pagina
 */
class Footer extends Component{

	/**
	 * Constructor
	 */
	constructor(props) {
		super(props);
		this.state = {}
    }

	//Funcion que renderiza el componente
	render(){
		return(
			<CardBody>
                <Col className="footer">
				</Col>
			</CardBody>
			
		)	
	}
}

//connectamos al redux los metodos instanciados.
export default Footer;