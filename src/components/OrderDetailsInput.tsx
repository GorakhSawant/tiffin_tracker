import React from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';

interface OrderDetailsInputProps {
  totalAmount: string;
  onTotalAmountChange: (value: string) => void;
  notes: string;
  onNotesChange: (value: string) => void;
  memberCount: number;
  perPersonAmount: string;
  onPerPersonAmountChange: (value: string) => void;
}

export const OrderDetailsInput: React.FC<OrderDetailsInputProps> = ({
  totalAmount,
  onTotalAmountChange,
  notes,
  onNotesChange,
  memberCount,
  perPersonAmount,
  onPerPersonAmountChange,
}) => {
  const handleTotalAmountChange = (value: string) => {
    onTotalAmountChange(value);
    if (value && !isNaN(parseFloat(value))) {
      onPerPersonAmountChange((parseFloat(value) / memberCount).toFixed(2));
    } else {
      onPerPersonAmountChange('');
    }
  };

  const handlePerPersonAmountChange = (value: string) => {
    onPerPersonAmountChange(value);
    if (value && !isNaN(parseFloat(value))) {
      onTotalAmountChange((parseFloat(value) * memberCount).toFixed(2));
    } else {
      onTotalAmountChange('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.amountContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Total Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={totalAmount}
            onChangeText={handleTotalAmountChange}
            keyboardType="numeric"
            placeholder="Enter total amount"
            placeholderTextColor="#999"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Per Person Amount (₹)</Text>
          <TextInput
            style={styles.input}
            value={perPersonAmount}
            onChangeText={handlePerPersonAmountChange}
            keyboardType="numeric"
            placeholder="Enter per person amount"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.notesContainer}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={onNotesChange}
          placeholder="Add any notes about the order"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  amountContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#B0BEC5',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  input: {
    backgroundColor: '#232344',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  notesContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#00E676',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  notesInput: {
    backgroundColor: '#232344',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    height: 100,
    textAlignVertical: 'top',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    borderWidth: 1,
    borderColor: '#00E676',
  },
});
