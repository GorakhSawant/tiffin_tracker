import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated, Platform } from 'react-native';
import { format, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { TiffinOrder, Member } from '../types';
import { OrderActions } from '../components/OrderActions';
import { OrderAmount } from '../components/OrderAmount';
import { useNavigation } from '@react-navigation/native';

export default function HistoryScreen() {
  const [orders, setOrders] = useState<TiffinOrder[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const navigation = useNavigation();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedOrders, storedMembers] = await Promise.all([
        AsyncStorage.getItem('orders'),
        AsyncStorage.getItem('members'),
      ]);

      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const getMemberNames = (memberIds: string[]): string[] => {
    return memberIds.map(id => {
      const member = members.find(m => m.id === id);
      return member ? member.name : 'Unknown';
    });
  };

  const getMonthlyOrders = () => {
    const start = startOfMonth(selectedMonth);
    const end = endOfMonth(selectedMonth);
    
    return orders
      .filter(order => {
        const orderDate = new Date(order.date);
        return isSameMonth(orderDate, selectedMonth);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const calculateMonthlyStats = () => {
    const monthlyOrders = getMonthlyOrders();
    const totalOrders = monthlyOrders.length;
    let totalAmount = 0;
    let memberTotals: { [key: string]: { amount: number; quantity: number } } = {};

    monthlyOrders.forEach(order => {
      if (order.totalAmount) {
        totalAmount += order.totalAmount;
      }
      
      // Handle orders with quantities
      const orderQuantities = order.memberQuantities || 
        order.members.map(id => ({ memberId: id, quantity: 1 }));
      
      orderQuantities.forEach(({ memberId, quantity }) => {
        if (!memberTotals[memberId]) {
          memberTotals[memberId] = { amount: 0, quantity: 0 };
        }
        memberTotals[memberId].quantity += quantity;
        if (order.perPersonAmount) {
          memberTotals[memberId].amount += order.perPersonAmount * quantity;
        }
      });
    });

    return {
      totalOrders,
      totalAmount,
      averageAmount: totalOrders > 0 ? totalAmount / totalOrders : 0,
      memberStats: Object.entries(memberTotals).map(([memberId, stats]) => ({
        name: members.find(m => m.id === memberId)?.name || 'Unknown',
        totalAmount: stats.amount,
        totalQuantity: stats.quantity,
        averagePerOrder: stats.quantity > 0 ? stats.amount / stats.quantity : 0,
      })),
    };
  };

  const changeMonth = (months: number) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + months);
    setSelectedMonth(newDate);
  };

  const handleEditOrder = (order: TiffinOrder) => {
    // Navigate to TodayScreen with the order data
    navigation.navigate('Today' as never, { editOrder: order } as never);
    setSelectedOrder(null);
  };

  const handleDeleteOrder = async (orderId: string) => {
    Alert.alert(
      'Delete Order',
      'Are you sure you want to delete this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedOrders = orders.filter(order => order.id !== orderId);
              await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
              setOrders(updatedOrders);
              setSelectedOrder(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete order');
            }
          },
        },
      ]
    );
  };

  const stats = calculateMonthlyStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={styles.monthArrow}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {format(selectedMonth, 'MMMM yyyy')}
        </Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={styles.monthArrow}>▶</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsHeader}>Monthly Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats.totalOrders}</Text>
            <Text style={styles.statLabel}>Total Orders</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{stats.totalAmount.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Amount</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>₹{stats.averageAmount.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Average/Order</Text>
          </View>
        </View>

        <Text style={styles.statsHeader}>Per Person Summary</Text>
        {stats.memberStats.sort((a, b) => b.totalAmount - a.totalAmount).map(stat => (
          <View key={stat.name} style={styles.memberStatCard}>
            <View style={styles.memberStatHeader}>
              <Text style={styles.memberName}>{stat.name}</Text>
              <Text style={styles.memberAmount}>₹{stat.totalAmount.toFixed(0)}</Text>
            </View>
            <View style={styles.memberStatDetails}>
              <Text style={styles.memberStatText}>Total Tiffins: {stat.totalQuantity}</Text>
              <Text style={styles.memberStatText}>Avg/Tiffin: ₹{stat.averagePerOrder.toFixed(0)}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.ordersHeader}>Daily Orders</Text>
      {getMonthlyOrders().map(order => (
        <View key={order.date} style={styles.dayContainer}>
          <Text style={styles.dateText}>{format(new Date(order.date), 'EEEE, MMMM d')}</Text>
          <View style={styles.orderDetails}>
            <Text style={styles.membersText}>
              Members: {getMemberNames(order.members).join(', ')}
            </Text>
            <View style={styles.amountContainer}>
              <View style={styles.amountRow}>
                <MaterialIcons name="attach-money" size={16} color="#2196f3" />
                <Text style={styles.amountText}>
                  Total: ₹{order.totalAmount} ({order.members.length} members)
                </Text>
              </View>
              <View style={styles.amountRow}>
                <MaterialIcons name="monetization-on" size={16} color="#4caf50" />
                <Text style={styles.amountText}>
                  Per Person: ₹{order.perPersonAmount?.toFixed(2)}
                </Text>
              </View>
            </View>
            {order.notes && (
              <Text style={styles.notesText}>Notes: {order.notes}</Text>
            )}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => handleEditOrder(order)}
              >
                <MaterialIcons name="edit" size={16} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteOrder(order.id)}
              >
                <MaterialIcons name="delete" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1B',
    padding: 16,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 8,
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
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  monthArrow: {
    fontSize: 24,
    color: '#00E5FF',
    padding: 8,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
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
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00E5FF',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  statLabel: {
    fontSize: 12,
    color: '#B0BEC5',
  },
  memberStatCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  memberStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  memberAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#00E676',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  memberStatDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStatText: {
    fontSize: 14,
    color: '#B0BEC5',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  orderDetails: {
    marginTop: 4,
  },
  membersText: {
    fontSize: 16,
    color: '#B0BEC5',
    marginBottom: 4,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  amountContainer: {
    marginVertical: 8,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
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
    marginBottom: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
    color: '#FFFFFF',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  notesText: {
    fontSize: 14,
    color: '#B0BEC5',
    fontStyle: 'italic',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  noOrderText: {
    fontSize: 16,
    color: '#B0BEC5',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 16,
    backgroundColor: '#1A1A2E',
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
  ordersHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginVertical: 16,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  dayContainer: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00E5FF',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  editButton: {
    backgroundColor: '#1A1A2E',
  },
  deleteButton: {
    backgroundColor: '#1A1A2E',
  },
});
