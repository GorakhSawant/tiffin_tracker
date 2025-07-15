import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Member } from '../types';

interface MemberItemProps {
  member: Member;
  onPress?: () => void;
  isSelected?: boolean;
  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
}

export const MemberItem: React.FC<MemberItemProps> = ({ 
  member, 
  onPress, 
  isSelected,
  quantity = 1,
  onQuantityChange
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, isSelected && styles.selected]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{member.name[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{member.name}</Text>
        {isSelected && (
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onQuantityChange?.(Math.max(1, quantity - 1))}
            >
              <MaterialIcons name="remove" size={20} color="#00E5FF" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => onQuantityChange?.(quantity + 1)}
            >
              <MaterialIcons name="add" size={20} color="#00E5FF" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    marginVertical: 4,
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
  selected: {
    backgroundColor: '#232344',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232344',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  quantityButton: {
    padding: 4,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00E5FF',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});
