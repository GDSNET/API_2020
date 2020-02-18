import React, { Component } from 'react';
import {View,  Text, StyleSheet, Dimensions} from 'react-native-web';
import '../../node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';

import data from '../images/prueba.json'

import { FileManager, FileNavigator } from '@opuscapita/react-filemanager';
import connectorNodeV1 from '@opuscapita/react-filemanager-connector-node-v1';


const apiOptions = {
  ...connectorNodeV1.apiOptions,
  apiRoot: `http://localhost:3020`// Or you local Server Node V1 installation.
}


class Principal extends Component {

constructor(props){

  super(props);
  this.state={
      mensaje:'Hola Mundo',
      variable : '',
      pass: '1234',
  }
}



funDescargar(){

  let json = JSON.stringify(data);
  let blob = new Blob([json], {type: "application/json"});
  let url = window.URL.createObjectURL(blob);
  this.downloadURI(url, "archivo.json");
  window.URL.revokeObjectURL(url);

  //fileDownload(data);
}

 downloadURI(uri, name) {
  let link = document.createElement("a");
  link.download = name;
  link.href = uri;
  link.style.display = "none";

  document.body.appendChild(link);
  if (typeof MouseEvent !== "undefined") {
      link.dispatchEvent(new MouseEvent("click"));
  } else {
      link.click();
  }
  document.body.removeChild(link);
}







  render() {
let ancho = Dimensions.get('window').width 
let alto = Dimensions.get('window').height 
let mitad = (ancho / 2) - 20
let trescuartos = (ancho / 1.7) 

    return (

        <View style={styles.container}>
          <View style={[styles.view_title, { background: 'linear-gradient(to right bottom, #2a8891, #f15138)'}]}>
            <Text style={styles.txt_title}>
              gds cloud
            </Text>

          </View>


<View style={styles.view_files}>
<FileManager>
       <FileNavigator
         id="filemanager-1"
         api={connectorNodeV1.api}
         apiOptions={apiOptions}
         capabilities={connectorNodeV1.capabilities}
         initialResourceId={'Lw'}
         listViewLayout={connectorNodeV1.listViewLayout}
         viewLayoutOptions={connectorNodeV1.viewLayoutOptions}
       />
     </FileManager>
  </View>

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

      flex: 1,

  
    },
    view_files: {

      flex: 1,
      height: 500,

  
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

      },
      view_title: {padding: 30},
      txt_title: {fontSize: 30, color: '#FFF'},
  });