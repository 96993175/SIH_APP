import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plus, Calendar, Droplets, Bug, Sprout } from 'lucide-react-native';

interface Activity {
  id: string;
  type: 'sowing' | 'irrigation' | 'pest' | 'fertilizer';
  title: string;
  description: string;
  date: string;
  timestamp: Date;
}

const activityTypes = [
  { id: 'sowing', title: 'Sowing', icon: Sprout, color: '#22C55E' },
  { id: 'irrigation', title: 'Irrigation', icon: Droplets, color: '#3B82F6' },
  { id: 'pest', title: 'Pest Control', icon: Bug, color: '#EF4444' },
  { id: 'fertilizer', title: 'Fertilizer', icon: Calendar, color: '#F59E0B' },
];

export default function ActivityScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('sowing');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const stored = await AsyncStorage.getItem('farmingActivities');
      if (stored) {
        const parsed = JSON.parse(stored).map((activity: any) => ({
          ...activity,
          timestamp: new Date(activity.timestamp),
        }));
        setActivities(parsed.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      }
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  const saveActivity = async () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    const newActivity: Activity = {
      id: Date.now().toString(),
      type: selectedType as any,
      title: title.trim(),
      description: description.trim(),
      date: new Date().toLocaleDateString(),
      timestamp: new Date(),
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);

    try {
      await AsyncStorage.setItem('farmingActivities', JSON.stringify(updatedActivities));
      setShowAddForm(false);
      setTitle('');
      setDescription('');
      setSelectedType('sowing');
    } catch (error) {
      console.error('Error saving activity:', error);
      Alert.alert('Error', 'Failed to save activity');
    }
  };

  const getActivityIcon = (type: string) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.icon : Calendar;
  };

  const getActivityColor = (type: string) => {
    const activityType = activityTypes.find(t => t.id === type);
    return activityType ? activityType.color : '#6B7280';
  };

  if (showAddForm) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Activity</Text>
          <TouchableOpacity onPress={() => setShowAddForm(false)}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Activity Type</Text>
          <View style={styles.typeGrid}>
            {activityTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    selectedType === type.id && { backgroundColor: type.color }
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <IconComponent
                    size={24}
                    color={selectedType === type.id ? '#FFFFFF' : type.color}
                  />
                  <Text style={[
                    styles.typeTitle,
                    selectedType === type.id && { color: '#FFFFFF' }
                  ]}>
                    {type.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Activity Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Activity title (e.g., Rice planting)"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.textArea}
            placeholder="Description and notes..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity style={styles.saveButton} onPress={saveActivity}>
            <Text style={styles.saveButtonText}>Save Activity</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Tracker</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddForm(true)}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
        {activities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📊</Text>
            <Text style={styles.emptyStateTitle}>No activities yet</Text>
            <Text style={styles.emptyStateText}>
              Start tracking your farming activities to maintain better records
            </Text>
          </View>
        ) : (
          activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const color = getActivityColor(activity.type);
            
            return (
              <View key={activity.id} style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={[styles.activityIcon, { backgroundColor: color + '20' }]}>
                    <IconComponent size={20} color={color} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDate}>{activity.date}</Text>
                  </View>
                </View>
                <Text style={styles.activityDescription}>{activity.description}</Text>
              </View>
            );
          })
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 24,
  },
  saveButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  activitiesList: {
    flex: 1,
    paddingHorizontal: 20,
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
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
});