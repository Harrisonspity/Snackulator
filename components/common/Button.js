import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

const Button = ({ onPress, style, children, ...props }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.7}
    {...props}
  >
    {children}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
