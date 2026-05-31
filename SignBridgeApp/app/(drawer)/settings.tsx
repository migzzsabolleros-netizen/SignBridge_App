import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme, setPreferredTheme } from '@/hooks/use-color-scheme';

export default function SettingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [notifications, setNotifications] = useState(true);

  const onToggleDark = (value: boolean) => {
    setPreferredTheme(value ? 'dark' : 'light');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f5f5f5' }]}> 
      <View style={[styles.topBar, { backgroundColor: isDark ? '#111827' : '#2E3192' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/') }>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
      </View>
      <View style={[styles.header, { backgroundColor: isDark ? '#111827' : '#2E3192' }]}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}> 
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>General</Text>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={24} color="#00e5ff" />
            <Text style={[styles.settingText, { color: isDark ? '#e5e7eb' : '#333' }]}>Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} thumbColor={isDark ? '#00e5ff' : undefined} trackColor={{ false: '#9ca3af', true: '#60a5fa' }} />
        </View>
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={24} color="#00e5ff" />
            <Text style={[styles.settingText, { color: isDark ? '#e5e7eb' : '#333' }]}>Dark Mode</Text>
          </View>
          <Switch value={isDark} onValueChange={onToggleDark} thumbColor={isDark ? '#00e5ff' : undefined} trackColor={{ false: '#9ca3af', true: '#60a5fa' }} />
        </View>
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}> 
        <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Account</Text>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/profile')}>
          <View style={styles.settingLeft}>
            <Ionicons name="person" size={24} color="#00e5ff" />
            <Text style={[styles.settingText, { color: isDark ? '#e5e7eb' : '#333' }]}>Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9ca3af' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/help')}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle" size={24} color="#00e5ff" />
            <Text style={[styles.settingText, { color: isDark ? '#e5e7eb' : '#333' }]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9ca3af' : '#ccc'} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/explore')}>
          <View style={styles.settingLeft}>
            <Ionicons name="compass" size={24} color="#00e5ff" />
            <Text style={[styles.settingText, { color: isDark ? '#e5e7eb' : '#333' }]}>Explore</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={isDark ? '#9ca3af' : '#ccc'} />
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: isDark ? '#1f2937' : '#fff' }]}> 
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: isDark ? '#dc2626' : '#ff4444' }]} onPress={() => Alert.alert('Logout', 'Are you sure?', [{ text: 'Cancel' }, { text: 'Logout' }])}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2E3192',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  topBar: {
    backgroundColor: '#2E3192',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  topBarTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});