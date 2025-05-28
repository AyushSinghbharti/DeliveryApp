import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import colours from './colours';

const Button = (props: any) => {
  const { title, onPress, styleButton, styleText } = props;

  return (
    <View style={[styles.container, styleButton]}>
      <TouchableOpacity style={styles.touchPart} onPress={onPress}>
        <Text style={[styles.buttonText, styleText]}>{title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FE8C00',
    borderRadius: 50,
    // width: 327,
    // height: 52,
    borderWidth: 1,
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
    elevation: 2.5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: '#fff',
    
  },
  touchPart: {
    flex: 1,
    width: '100%',
    // height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }

})
export default Button