import React, { Suspense, lazy, Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import promise from "redux-promise-middleware";
import thunk from 'redux-thunk'
import ReducerSearch from './components/RSearch';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import "./styles/Canvan.scss";

//Cargamos con Lazy solo el modulo solicitado  
const ProductList = lazy(() => import("./canvan/ProductList"));
const Product = lazy(() => import("./canvan/Product"));

//Instanciamos los componente al reducer que gestiona el almacenamiento del store
const reducer = combineReducers({
	/** 
	 * El componente ReducerSerch se encargara de gestionar la información que sera requerida por 
	 * los compoentes ProductList y Product 
	**/
    ReducerSearch: ReducerSearch.RSearch, 
});

//Store que gestionara el estado global de la apliación
const store = createStore(reducer, applyMiddleware(thunk, promise));

/** *
 * Componente que gestiona el enrutamiento de la pagina 
 * Se define la store redux para mantener centralizado los datos y su acceso
*/
class Router extends Component{

	//Renderizamos el componente que de acuerdo a la ruta esta siendo solicitado
	render(){
		return(
            <BrowserRouter ref={this.props.innerRef}>
                <Provider store={store} >
					<Suspense fallback={<div>Loading Módulo...</div>}>
						<Switch>
							<Route  path="/" render={props => <ProductList {...props} />}  exact/>
							<Route path="/items"  render={props => <ProductList {...props} />}  exact/>
							<Route path="/items/:id" render={props => <Product {...props} />} exact/>
						</Switch>
					</Suspense>
                </Provider>
            </BrowserRouter>
		)	
	}
}

ReactDOM.render(
	<Router/>,
	document.getElementById('root')
);