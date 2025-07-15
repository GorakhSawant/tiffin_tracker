import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface OrderAmountProps {
  totalAmount: number;
  perPersonAmount: number;
  style?: any;
}

export const OrderAmount: React.FC<OrderAmountProps> = ({ totalAmount, perPersonAmount, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.amountRow}>
        <MaterialIcons name="payment" size={18} color="#00E5FF" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.amountText}>₹{totalAmount.toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.amountRow}>
        <MaterialIcons name="person" size={18} color="#00E676" />
        <View style={styles.textContainer}>
          <Text style={styles.label}>Per Person</Text>
          <Text style={styles.amountText}>₹{perPersonAmount.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 2,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#B0BEC5',
    marginBottom: 2,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});