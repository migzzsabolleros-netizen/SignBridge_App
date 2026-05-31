import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useUser } from '../context/_UserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function MainScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [recentActivities] = useState([
    { title: 'Translated "Hello" from live camera', subtitle: 'Today · 2m ago' },
    { title: 'Captured phrase: "How are you?"', subtitle: 'Yesterday · 4:10 PM' },
    { title: 'Saved most recent translation', subtitle: 'May 30 · 08:12 AM' },
  ]);

  const handleOpenDrawer = () => {
    try {
      if (navigation.dispatch) {
        navigation.dispatch(DrawerActions.openDrawer());
      }
    } catch (e) {
      Alert.alert("Menu", "Drawer navigation coming soon!");
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#F8F9FE' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={isDark ? '#0f172a' : '#2E3192'} />

      {/* --- Top App Bar --- */}
      <View style={[styles.topBar, { backgroundColor: isDark ? '#111827' : '#2E3192' }]}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton} onPress={handleOpenDrawer}>
            <Ionicons name="menu" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>SignBridge+</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Welcome Section --- */}
        <View style={styles.welcomeSection}>
          <Text style={[styles.greetingText, { color: isDark ? '#E5E7EB' : '#1A1C3D' }]}>Hello, {user?.name ? user.name : 'User'}!</Text>
          <Text style={[styles.subGreeting, { color: isDark ? '#94a3b8' : '#6E7191' }]}>Ready to translate today?</Text>
        </View>

        {/* --- Main Action Card --- */}
        <TouchableOpacity 
          style={styles.mainCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/translate')}
        >
          <View style={styles.cameraCircle}>
            <Ionicons name="videocam" size={42} color="#2E3192" />
          </View>
          <Text style={styles.cardTitle}>Start Translating</Text>
          <Text style={styles.cardSubText}>Point camera at FSL signs</Text>
          
          {/* Context Badge */}
          <View style={styles.contextBadge}>
            <View style={styles.activeDot} />
            <Text style={styles.contextText}>Context: General</Text>
          </View>
        </TouchableOpacity>

        {/* --- Recent Activity --- */}
        <View style={[styles.activitySection, { backgroundColor: isDark ? '#111827' : '#ffffff', borderColor: isDark ? '#334155' : '#E2E8F0' }]}>
          <View style={styles.activityHeader}>
            <View style={styles.activityHeaderLeft}>
              <Ionicons name="time-outline" size={20} color="#2E3192" />
              <Text style={[styles.activityTitleText, { color: isDark ? '#e2e8f0' : '#1F2937' }]}>Recent Activity</Text>
            </View>
            <Text style={[styles.activityCount, { color: isDark ? '#94a3b8' : '#6B7280' }]}>{recentActivities.length} items</Text>
          </View>

          {recentActivities.map((activity, index) => (
            <TouchableOpacity
              key={index}
              style={styles.activityItem}
              activeOpacity={0.8}
              onPress={() => Alert.alert(activity.title, activity.subtitle)}
            >
              <View style={styles.activityBullet} />
              <View style={styles.activityMeta}>
                <Text style={styles.activityItemTitle}>{activity.title}</Text>
                <Text style={styles.activityItemSubtitle}>{activity.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>

        {/* --- FSL Tip of the Day --- */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={20} color="#F1C40F" />
            <Text style={styles.tipTitle}>FSL Tip of the Day</Text>
          </View>
          <Text style={styles.tipDescription}>
            Facial expressions are a crucial part of FSL. They represent the "tone" of your voice!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Light neutral background
  },
  topBar: {
    height: 64,
    backgroundColor: '#2E3192',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 8,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  iconButton: { padding: 8 },
  pageTitle: { color: 'white', fontSize: 22, fontWeight: 'bold', marginLeft: 8 },
  
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1C3D',
  },
  subGreeting: {
    fontSize: 16,
    color: '#6E7191',
    marginTop: 4,
  },
  mainCard: {
    backgroundColor: '#2E3192',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#2E3192',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 20,
  },
  cameraCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cardSubText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  contextBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80', // Green dot
    marginRight: 8,
  },
  contextText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  activitySection: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTitleText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  activityCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityBullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E3192',
    marginRight: 14,
  },
  activityMeta: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  activityItemSubtitle: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },
  tipCard: {
    backgroundColor: '#FFFBEB', // Light yellow tint
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
  },
  tipDescription: {
    fontSize: 14,
    color: '#B45309',
    lineHeight: 20,
  },
});