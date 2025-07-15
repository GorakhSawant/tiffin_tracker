import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Member } from '../types';

export default function MembersScreen() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');

  React.useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const storedMembers = await AsyncStorage.getItem('members');
      if (storedMembers) {
        setMembers(JSON.parse(storedMembers));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load members');
    }
  };

  const addMember = async () => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
      };
      const updatedMembers = [...members, newMember];
      try {
        await AsyncStorage.setItem('members', JSON.stringify(updatedMembers));
        setMembers(updatedMembers);
        setNewMemberName('');
      } catch (error) {
        Alert.alert('Error', 'Failed to save member');
      }
    }
  };

  const removeMember = async (id: string) => {
    Alert.alert(
      'Remove Member',
      'Are you sure you want to remove this member?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updatedMembers = members.filter(member => member.id !== id);
            try {
              await AsyncStorage.setItem('members', JSON.stringify(updatedMembers));
              setMembers(updatedMembers);
            } catch (error) {
              Alert.alert('Error', 'Failed to remove member');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Members</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMemberName}
          onChangeText={setNewMemberName}
          placeholder="Enter member name"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.addButton} onPress={addMember}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listContainer}>
        {members.length === 0 ? (
          <Text style={styles.noMembersText}>No members added yet.</Text>
        ) : (
          members.map(member => (
            <TouchableOpacity
              key={member.id}
              style={styles.memberItem}
              onLongPress={() => removeMember(member.id)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.name[0].toUpperCase()}</Text>
              </View>
              <Text style={styles.memberName}>{member.name}</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => removeMember(member.id)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A1B',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
    borderWidth: 1,
    borderColor: '#00E5FF',
  },
  addButton: {
    backgroundColor: '#00E5FF',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
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
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  memberItem: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#232344',
  },
  removeButtonText: {
    color: '#FF4081',
    fontSize: 14,
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
  noMembersText: {
    fontSize: 16,
    color: '#B0BEC5',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic',
    fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace' }),
  },
});
