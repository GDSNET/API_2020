
import React, { Component } from 'react';
import Lottie from 'lottie-react-web'
import {View, Text, StyleSheet, Button, TouchableOpacity} from 'react-native-web'


export default class LoginInput extends Component {

  constructor(props){
    super(props)
    this.state = {  
      isToggled: false  
    }


  }

  funCambiar(){
    this.setState({ isToggled: !this.state.isToggled})
    
  }

  render() {    

    const {icon, funPress, width, speed} = this.props;

    return (
    <View>

      <TouchableOpacity style={styles.container} 
        onMouseEnter={()=>this.funCambiar()}
        onMouseLeave={()=>this.funCambiar()}
        onPress={()=>funPress()}>
        
        <Lottie  style={styles.viewlottie} 
            width={width}
            speed= {speed}
            direction={this.state.isToggled ? 1 : -1}
            options={{
              animationData: icon,
              loop: true,
           
            }}
          />
        </TouchableOpacity>
        
        

    


    </View>


    )
  }

}


const styles = StyleSheet.create({
   
    container: {

      
    }
  });
  