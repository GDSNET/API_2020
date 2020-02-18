import React, { Component } from 'react';
import {View,  Text, StyleSheet, Dimensions} from 'react-native-web';
import FlipPage from 'react-flip-page';

import image1 from '../images/IMG_0962.JPG'
import image2 from '../images/IMG_0964.JPG'
import image3 from '../images/IMG_0965.JPG'
import image4 from '../images/IMG_0967.JPG'
import image5 from '../images/IMG_0969.JPG'
import image6 from '../images/IMG_0970.JPG'
import pluma from '../images/Pluma.png'

class Principal extends Component {

constructor(props){

  super(props);
  this.state={
      mensaje:'Hola Mundo',
      variable : '',

  }

 
}




  render() {
let ancho = Dimensions.get('window').width 
let alto = Dimensions.get('window').height 
let mitad = (ancho / 2) - 20
let trescuartos = (ancho / 1.7) 

    return (

        <View style={styles.container}>


<FlipPage orientation='horizontal'
width={ancho}
height={alto}
flipOnTouch={true}
pageBackground={'linear-gradient(to right, #2D3840, #0E161C)'}> 


<View style={styles.pagina}>

<View style={styles.hoja}>
        <View style={styles.titleXL}> 
                <Text style={styles.txtTitleXL}>Licenciatura</Text>
                <Text style={styles.txtTitleXL}> 2020 </Text>
        </View>
        
</View>
<View style={styles.hoja}>
        <View style={styles.titleXL}> 
        <img src={pluma} alt="Pluma" ></img>
        </View>
</View>
</View>  

    <View style={styles.pagina}>

                <View style={styles.hoja}>
                        <View style={styles.title}> 
                                <Text style={styles.txtTitle}> Texto de Ejemplo</Text>
                        </View>
                        <View style={styles.imagen}> 
                                <img src={image1} alt="Smiley face" width={mitad}></img>
                        </View>
                </View>
                <View style={styles.hoja}>
                        <View style={styles.title}> 
                        <Text style={styles.txtTitle}> puede ser modificable segun Imagen </Text>
                        </View>
                        <View style={styles.imagen}> 
                                <img src={image2} alt="Smiley face" width={mitad}></img>
                        </View>
                </View>
    </View>  
    <View style={styles.pagina}>

    <View style={styles.hoja}>
                        <View style={styles.title}> 
                        <Text style={styles.txtTitle}> Titulos Alternativos </Text>
                        </View>
                        <View style={styles.imagen}> 
                                <img src={image3} alt="Smiley face" width={trescuartos}></img>
                        </View>
                </View>
    </View>  
    <View style={styles.pagina}>

<View style={styles.hoja}>
        <View style={styles.title}> 
                <Text style={styles.txtTitle}> Texto de Ejemplo</Text>
        </View>
        <View style={styles.imagen}> 
                <img src={image4} alt="Smiley face" width={mitad}></img>
        </View>
</View>
<View style={styles.hoja}>
        <View style={styles.title}> 
        <Text style={styles.txtTitle}> puede ser modificable segun Imagen </Text>
        </View>
        <View style={styles.imagen}> 
                <img src={image5} alt="Smiley face" width={mitad}></img>
        </View>
</View>
</View>  
<View style={styles.pagina}>

<View style={styles.hoja}>
        <View style={styles.title}> 
        <Text style={styles.txtTitle}> Titulos Alternativos </Text>
        </View>
        <View style={styles.imagen}> 
                <img src={image6} alt="Smiley face" width={trescuartos}></img>
        </View>
</View>
</View>  


</FlipPage>
            </View>  
      
    );
  }
}








export default (Principal);


const styles = StyleSheet.create({
    flipstyle: {
        backgroundColor: '#FFF',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
    
      },
   
    container: {
      backgroundColor: '#FFF',
      flex: 1,
      flexDirection: 'row'
  
    },
    hoja: {
        
        flex: 1,
        alignItems:  'center',
        justifyContent: 'center',
        
        margin: 10,
        padding: 10,
        
    
      },
      title: {
        
        
        alignItems:  'center',
        justifyContent: 'center',
        
        margin: 10,
        padding: 10,
        
    
      },
      titleXL: {
        alignItems:  'center',
        justifyContent: 'center',
        marginTop: 200,
        

      },
      imagen: {
        flex: 1,
        alignItems:  'center',
        justifyContent: 'center',
        margin: 10,
        padding: 10,
    
      },
      pagina: {
        flex: 1,
        flexDirection: 'row'
      },
      txtTitle: {

        color: '#FFF',
        fontSize: 25

      },
      txtTitleXL: {

        color: '#FFF',
        fontSize: 50

      }
  });