import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { format } from 'date-fns';
import { MaterialIcons } from '@expo/vector-icons';

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onDateChange }) => {
  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    onDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={() => changeDate(-1)}
      >
        <MaterialIcons name="chevron-left" size={24} color="#00E5FF" />
      </TouchableOpacity>
      
      <View style={styles.dateContainer}>
        <Text style={styles.dateText}>{format(date, 'EEEE')}</Text>
        <Text style={styles.fullDate}>{format(date, 'MMMM d, yyyy')}</Text>
      </View>
      
      <TouchableOpacity 
        style={styles.arrowButton} 
        onPress={() => changeDate(1)}
      >
        <MaterialIcons name="chevron-right" size={24} color="#00E5FF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  dateContainer: {
    flex: 1,
    alignItems: 'center',
  },
  dateText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#00E5FF',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  fullDate: {
    fontSize: 14,
    color: '#B0BEC5',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  arrowButton: {
    padding: 8,
  },
});
