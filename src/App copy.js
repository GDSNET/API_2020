import React, { Component } from 'react';
import { connect } from "react-redux";
import ControlActions from "./actions/index";
import {bindActionCreators} from 'redux';
import Mainprincipal from './screen/MainPrincipal'
import Promocion from './screen/Promocion'
import Main from './screen/Main';
import { TouchableOpacity, View, Text } from 'react-native-web';


class App extends Component {

constructor(props){

  super(props);
  this.state={
      mensaje:'Hola Mundo',
      valor : ''
  }

 
}

funExec (valor){
  if (valor == 'Main' ){
    return(
      <Main />
    )
  }
  else if  (valor == 'Promocion' ){
   return( <Promocion /> ) 
  }

  else {
    return( <View>
      <TouchableOpacity onPress={()=>{this.funIr('Main')}}>
        <Text> Main </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={()=>{this.funIr('Promocion')}}>
        <Text> Promocion </Text>
      </TouchableOpacity>
    </View> ) 
  }
}

funIr(valor){
this.setState({
  valor
})
}


  render() {
    return (
      <div>
          {this.funExec(this.state.valor)}
      </div>
    );
  }
}





function mapStateToProps(state){
  return{
    ...state

  }
}

function mapDispatchToProps (dispatch) {
 const combiner = Object.assign({},
ControlActions,
{dispatch}
);
return bindActionCreators(
  combiner,
  dispatch,
);
}



export default connect(mapStateToProps, mapDispatchToProps)(App);
