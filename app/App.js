import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Routes from './src/navigation';
import { Block } from './src/components';
import { AuthProvider } from './src/contexts/auth';
import CartProvider from './src/contexts/cart';

export default class App extends React.Component {

  render(){
    return (
      <Block white>
        <AuthProvider>
          <CartProvider>
            <Routes />
          </CartProvider>
        </AuthProvider>
      </Block>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});