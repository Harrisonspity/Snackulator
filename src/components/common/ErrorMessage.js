import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

const ErrorMessage = ({ message, style }) => {
  if (!message) return null;
  return <Text style={[styles.error, style]}>{message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: Colors.danger,
    fontSize: 14,
    marginVertical: 8,
    textAlign: 'center',
  },
});

export default ErrorMessage;
