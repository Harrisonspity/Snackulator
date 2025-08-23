import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ErrorMessage = ({ message, type = 'error' }) => {
  const backgroundColor = type === 'error' ? '#ffebee' : '#fff3e0';
  const textColor = type === 'error' ? '#c62828' : '#e65100';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ErrorMessage;