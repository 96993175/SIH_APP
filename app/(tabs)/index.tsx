import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bot, Activity, Calendar, Bell, Camera, Cloud } from 'lucide-react-native';

export default function HomeScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [weather, setWeather] = useState('🌤️ Partly cloudy, 28°C');
  const [reminder, setReminder] = useState('🌧️ Rain expected tomorrow, avoid spraying pesticides');
  const router = useRouter();

  useEffect(() => {
    loadUserData();
    loadWeather();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem('userData');
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const locationData = await AsyncStorage.getItem('userLocation');
      if (locationData) {
        // In real app, make API call to OpenWeather
        // For demo, showing static data
        const weatherData = [
          '☀️ Sunny, 32°C - Perfect for field work',
          '🌧️ Rain expected, 24°C - Good for irrigation',
          '⛅ Cloudy, 28°C - Ideal for spraying',
          '🌪️ Windy, 26°C - Avoid pesticide application'
        ];
        const randomWeather = weatherData[Math.floor(Math.random() * weatherData.length)];
        setWeather(randomWeather);
      }
    } catch (error) {
      console.error('Error loading weather:', error);
    }
  };

  const navigateToAIChat = () => {
    router.push('/ai-chat');
  };

  const navigateToActivityTracking = () => {
    router.push('/(tabs)/activity');
  };

  const navigateToSchemes = () => {
    router.push('/(tabs)/schemes');
  };

  const navigateToCropDisease = () => {
    router.push('/crop-disease');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>
              Good {new Date().getHours() < 12 ? 'Morning' : 'Evening'}
            </Text>
            <Text style={styles.userName}>{userData?.name || 'Farmer'}</Text>
          </View>
          
          <TouchableOpacity style={styles.aiButton} onPress={navigateToAIChat}>
            <View style={styles.aiButtonInner}>
              <Bot size={24} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.weatherCard}>
          <Cloud size={20} color="#3B82F6" />
          <Text style={styles.weatherText}>{weather}</Text>
        </View>

        <View style={styles.reminderCard}>
          <View style={styles.reminderHeader}>
            <Bell size={20} color="#F59E0B" />
            <Text style={styles.reminderTitle}>Today's Reminder</Text>
          </View>
          <Text style={styles.reminderText}>{reminder}</Text>
        </View>

        <View style={styles.featuresGrid}>
          <TouchableOpacity style={styles.featureCard} onPress={navigateToActivityTracking}>
            <View style={styles.featureIcon}>
              <Activity size={32} color="#22C55E" />
            </View>
            <Text style={styles.featureTitle}>Activity Tracking</Text>
            <Text style={styles.featureDescription}>
              Log your farming activities and maintain records
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={navigateToSchemes}>
            <View style={styles.featureIcon}>
              <Calendar size={32} color="#3B82F6" />
            </View>
            <Text style={styles.featureTitle}>Government Schemes</Text>
            <Text style={styles.featureDescription}>
              Explore subsidies and schemes for farmers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureCard} onPress={navigateToCropDisease}>
            <View style={styles.featureIcon}>
              <Camera size={32} color="#EF4444" />
            </View>
            <Text style={styles.featureTitle}>Crop Disease Detection</Text>
            <Text style={styles.featureDescription}>
              Detect diseases and pests using camera
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    flex: 1,
  },
  greetingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  aiButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22C55E',
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  aiButtonInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  reminderCard: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  reminderText: {
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
  featuresGrid: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});