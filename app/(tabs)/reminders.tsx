import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bell, Calendar, Cloud, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';

interface Reminder {
  id: string;
  type: 'weather' | 'task' | 'scheme' | 'general';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  isRead: boolean;
}

const defaultReminders: Reminder[] = [
  {
    id: '1',
    type: 'weather',
    title: 'Rain Alert',
    message: 'Heavy rainfall expected tomorrow. Avoid spraying pesticides and ensure proper drainage.',
    priority: 'high',
    timestamp: new Date(),
    isRead: false,
  },
  {
    id: '2',
    type: 'task',
    title: 'Irrigation Due',
    message: 'Your crops need watering. Last irrigation was 3 days ago.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '3',
    type: 'scheme',
    title: 'PM-KISAN Application',
    message: 'PM-KISAN next installment registration closes in 5 days.',
    priority: 'high',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '4',
    type: 'general',
    title: 'Fertilizer Application',
    message: 'Apply NPK fertilizer for better crop yield. Best time: early morning.',
    priority: 'medium',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isRead: true,
  },
];

export default function RemindersScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const stored = await AsyncStorage.getItem('farmingReminders');
      if (stored) {
        const parsed = JSON.parse(stored).map((reminder: any) => ({
          ...reminder,
          timestamp: new Date(reminder.timestamp),
        }));
        setReminders(parsed);
      } else {
        setReminders(defaultReminders);
        await AsyncStorage.setItem('farmingReminders', JSON.stringify(defaultReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
      setReminders(defaultReminders);
    }
  };

  const markAsRead = async (reminderId: string) => {
    const updatedReminders = reminders.map(reminder =>
      reminder.id === reminderId ? { ...reminder, isRead: true } : reminder
    );
    setReminders(updatedReminders);
    
    try {
      await AsyncStorage.setItem('farmingReminders', JSON.stringify(updatedReminders));
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return Cloud;
      case 'task':
        return CheckCircle;
      case 'scheme':
        return Calendar;
      default:
        return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const unreadReminders = reminders.filter(r => !r.isRead);
  const readReminders = reminders.filter(r => r.isRead);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reminders</Text>
        {unreadReminders.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadReminders.length}</Text>
          </View>
        )}
      </View>

      <ScrollView style={styles.remindersList} showsVerticalScrollIndicator={false}>
        {unreadReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New</Text>
            {unreadReminders.map((reminder) => {
              const IconComponent = getIcon(reminder.type);
              return (
                <TouchableOpacity
                  key={reminder.id}
                  style={[styles.reminderCard, styles.unreadCard]}
                  onPress={() => markAsRead(reminder.id)}
                >
                  <View style={styles.reminderHeader}>
                    <View style={[styles.reminderIcon, { backgroundColor: getPriorityColor(reminder.priority) + '20' }]}>
                      <IconComponent size={20} color={getPriorityColor(reminder.priority)} />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={styles.reminderTitle}>{reminder.title}</Text>
                      <Text style={styles.reminderTime}>{formatTime(reminder.timestamp)}</Text>
                    </View>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(reminder.priority) }]} />
                  </View>
                  <Text style={styles.reminderMessage}>{reminder.message}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {readReminders.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Earlier</Text>
            {readReminders.map((reminder) => {
              const IconComponent = getIcon(reminder.type);
              return (
                <View key={reminder.id} style={[styles.reminderCard, styles.readCard]}>
                  <View style={styles.reminderHeader}>
                    <View style={[styles.reminderIcon, { backgroundColor: '#F3F4F6' }]}>
                      <IconComponent size={20} color="#9CA3AF" />
                    </View>
                    <View style={styles.reminderInfo}>
                      <Text style={[styles.reminderTitle, styles.readTitle]}>{reminder.title}</Text>
                      <Text style={styles.reminderTime}>{formatTime(reminder.timestamp)}</Text>
                    </View>
                    <CheckCircle size={16} color="#22C55E" />
                  </View>
                  <Text style={[styles.reminderMessage, styles.readMessage]}>{reminder.message}</Text>
                </View>
              );
            })}
          </View>
        )}

        {reminders.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🔔</Text>
            <Text style={styles.emptyStateTitle}>No reminders</Text>
            <Text style={styles.emptyStateText}>
              You'll receive notifications about weather alerts, farming tasks, and scheme deadlines here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  remindersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  reminderCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  readCard: {
    opacity: 0.7,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reminderInfo: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  readTitle: {
    color: '#6B7280',
  },
  reminderTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  reminderMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  readMessage: {
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});