import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Text,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useRoute } from '@react-navigation/native';
import { Member, TiffinOrder } from '../types';
import { TodayScreenRouteProp } from '../types/navigation';
import { MemberItem } from '../components/MemberItem';
import { DatePicker } from '../components/DatePicker';
import { OrderDetailsInput } from '../components/OrderDetailsInput';

export default function TodayScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberQuantities, setMemberQuantities] = useState<{ [key: string]: number }>({});
  const [orders, setOrders] = useState<TiffinOrder[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalAmount, setTotalAmount] = useState('');
  const [perPersonAmount, setPerPersonAmount] = useState('');
  const [notes, setNotes] = useState('');
  const route = useRoute<TodayScreenRouteProp>();
  const editOrder = route.params?.editOrder;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadExistingOrder();
  }, [selectedDate, orders]);

  useEffect(() => {
    if (editOrder) {
      setSelectedDate(new Date(editOrder.date));
      setSelectedMembers(editOrder.members);
      setTotalAmount(editOrder.totalAmount?.toString() || '');
      setNotes(editOrder.notes || '');
    }
  }, [editOrder]);

  const loadData = async () => {
    try {
      const [storedMembers, storedOrders] = await Promise.all([
        AsyncStorage.getItem('members'),
        AsyncStorage.getItem('orders'),
      ]);

      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      }
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load data');
    }
  };

  const loadExistingOrder = () => {
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingOrder = orders.find(order => order.date === dateStr);
    
    if (existingOrder) {
      setSelectedMembers(existingOrder.members);
      setTotalAmount(existingOrder.totalAmount?.toString() || '');
      setNotes(existingOrder.notes || '');
    } else {
      setSelectedMembers([]);
      setTotalAmount('');
      setNotes('');
    }
  };

  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleQuantityChange = (memberId: string, quantity: number) => {
    setMemberQuantities(prev => ({
      ...prev,
      [memberId]: quantity
    }));
  };

  const calculateTotalQuantity = () => {
    return selectedMembers.reduce((total, memberId) => total + (memberQuantities[memberId] || 1), 0);
  };

  const saveOrder = async () => {
    if (selectedMembers.length === 0) {
      Alert.alert('Error', 'Please select at least one member');
      return;
    }

    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const existingOrder = orders.find(order => order.date === dateStr);
    const amount = totalAmount ? parseFloat(totalAmount) : undefined;
    const totalQuantity = calculateTotalQuantity();
    const perPerson = amount ? amount / totalQuantity : undefined;

    const orderData: TiffinOrder = {
      id: existingOrder?.id || Date.now().toString(),
      date: dateStr,
      members: selectedMembers,
      memberQuantities: selectedMembers.map(id => ({
        memberId: id,
        quantity: memberQuantities[id] || 1
      })),
      notes: notes.trim(),
      totalAmount: amount,
      perPersonAmount: perPerson,
    };

    if (existingOrder) {
      Alert.alert(
        'Update Order',
        'An order already exists for this date. Do you want to update it?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Update',
            onPress: async () => {
              const updatedOrders = orders.map(order =>
                order.date === dateStr ? orderData : order
              );
              try {
                await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
                setOrders(updatedOrders);
                Alert.alert('Success', 'Order updated successfully');
              } catch (error) {
                Alert.alert('Error', 'Failed to update order');
              }
            },
          },
        ]
      );
      return;
    }

    try {
      const updatedOrders = [...orders, orderData];
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      setOrders(updatedOrders);
      Alert.alert('Success', 'Order saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save order');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <DatePicker 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate}
        />

        <Text style={styles.sectionTitle}>Select Members</Text>
        <View style={styles.membersContainer}>
          {members.map(member => (
            <MemberItem
              key={member.id}
              member={member}
              isSelected={selectedMembers.includes(member.id)}
              onPress={() => toggleMember(member.id)}
              quantity={memberQuantities[member.id] || 1}
              onQuantityChange={(quantity) => handleQuantityChange(member.id, quantity)}
            />
          ))}
        </View>

        {selectedMembers.length > 0 && (
          <OrderDetailsInput
            totalAmount={totalAmount}
            onTotalAmountChange={setTotalAmount}
            perPersonAmount={perPersonAmount}
            onPerPersonAmountChange={setPerPersonAmount}
            notes={notes}
            onNotesChange={setNotes}
            memberCount={selectedMembers.length}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.selectedCount}>
            Selected: {selectedMembers.length} members
          </Text>
          <TouchableOpacity 
            style={[styles.saveButton, selectedMembers.length === 0 && styles.saveButtonDisabled]} 
            onPress={saveOrder}
            disabled={selectedMembers.length === 0}
          >
            <Text style={styles.saveButtonText}>Save Order</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1B',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  membersContainer: {
    marginBottom: 16,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  selectedCount: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: '#90caf9',
    shadowOpacity: 0.1,
    elevation: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
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
  buttonText: {
    color: '#1A1A2E',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});
