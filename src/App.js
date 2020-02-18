import React, { Component } from 'react';
import {View,  TextInput, StyleSheet, Text} from 'react-native-web';
import Princiapl from './screen/Principal'
import Descargas from './screen/Descargas'
import gds from './images/gds.svg'
import LottieLoop from './screen/LottieLoop'
import icono from './images/imagetablet.json'

class App extends Component {

constructor(props){

  super(props);
  this.state={
      mensaje:'Hola Mundo',
      variable : '',
      pass: 'anuario2020',
      descarga: 'gdsduoscj2020'
  }

 
}

funEnviar(){
  return ('')
}

funRevisarLogin(){


  if(this.state.variable===this.state.pass){
    return(
      <Princiapl />
    )
  }
  else if(this.state.variable===this.state.descarga){
    return(
      <Descargas />
    )
  }
  else {
    return(
      <View style={styles.title}>

<img style={{width: 150, marginTop: 50}}
            src={gds} />


<TextInput style = {styles.input} 
              autoCapitalize="none" 
              onChangeText={(variable) => this.setState({ variable })}
              autoCorrect={false} 
              keyboardType='email-address' 
              returnKeyType="next" 
              placeholder='Clave Acceso' 
              placeholderTextColor='#FFF'/>

      <LottieLoop
             width={400}
             icon={icono}
             funPress={()=>this.funEnviar()}

                    />



   </View>
    )
  }

  
}



  render() {
    return (



      
        <View>
          
           {this.funRevisarLogin()}
        </View>  
      
    );
  }
}








export default (App);



const styles = StyleSheet.create({
  input:{
    height: 40,
    width: 150,
    backgroundColor: '#ddd',
    borderRadius: 30,
    marginBottom: 10,
    padding: 10,
    color: '#666',
    alignItems: 'center',
    marginTop: 30
  },

  title: {
        
        
    alignItems:  'center',
    justifyContent: 'center',
    
    margin: 10,
    padding: 10,
    

  },
});

