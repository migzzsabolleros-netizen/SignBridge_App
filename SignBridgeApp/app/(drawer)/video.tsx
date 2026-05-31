import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  NativeModules,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

const { FSLOverlayModule } = NativeModules;

export default function VideoScreen() {
  const router = useRouter();
  const [meetingId, setMeetingId] = useState('');
  const [meetingPassword, setMeetingPassword] = useState('');
  const [overlayActive, setOverlayActive] = useState(false);

  const startOverlay = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return false;
    try {
      const hasPerm = await FSLOverlayModule.hasOverlayPermission();
      if (!hasPerm) {
        Alert.alert(
          'Permission Required',
          'Please allow "Display over other apps" for SignBridge:\n\nSettings → Apps → SignBridgeApp → Display over other apps → Turn ON\n\nThen try again.',
          [
            {
              text: 'Open Settings',
              onPress: () => FSLOverlayModule.startOverlay().catch(() => {}),
            },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return false;
      }
      await FSLOverlayModule.startOverlay();
      setOverlayActive(true);
      return true;
    } catch (e: any) {
      Alert.alert('Overlay Error', e?.message ?? 'Could not start FSL overlay');
      return false;
    }
  }, []);

  const stopOverlay = useCallback(async () => {
    if (Platform.OS !== 'android') return;
    try {
      await FSLOverlayModule.stopOverlay();
      setOverlayActive(false);
    } catch {}
  }, []);

  const startZoomCall = async () => {
    const started = await startOverlay();
    if (!started) return;
    const zoomUrl = 'zoomus://';
    const supported = await Linking.canOpenURL(zoomUrl);
    Linking.openURL(supported ? zoomUrl : 'https://zoom.us/join');
  };

  const startGoogleMeet = async () => {
    const started = await startOverlay();
    if (!started) return;
    Linking.openURL('https://meet.google.com');
  };

  const joinZoomMeeting = async () => {
    if (!meetingId) { Alert.alert('Error', 'Please enter a Meeting ID'); return; }
    const started = await startOverlay();
    if (!started) return;
    const url = `zoomus://zoom.us/join?confno=${meetingId}${meetingPassword ? `&pwd=${meetingPassword}` : ''}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Zoom Not Found', 'Please install the Zoom app.');
      Linking.openURL(`https://zoom.us/j/${meetingId}${meetingPassword ? `?pwd=${meetingPassword}` : ''}`);
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.container}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Video</Text>
          {overlayActive && (
            <TouchableOpacity style={styles.stopOverlayBtn} onPress={stopOverlay}>
              <Ionicons name="hand-left" size={14} color="#fff" />
              <Text style={styles.stopOverlayText}>Stop FSL</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Video Conferencing</Text>
          <Text style={styles.subtitle}>FSL overlay runs on top of any call</Text>
        </View>

        {/* Permission callout */}
        <View style={styles.callout}>
          <Ionicons name="information-circle" size={18} color="#00e5ff" />
          <Text style={styles.calloutText}>
            The FSL overlay floats over Zoom or Meet. Before first use, grant{' '}
            <Text style={styles.calloutBold}>Display over other apps</Text> permission in Settings.
            Tap ▶ in the overlay to start translating.
          </Text>
        </View>

        {/* Quick Start */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity style={styles.callButton} onPress={startZoomCall}>
            <Ionicons name="videocam" size={22} color="#fff" />
            <Text style={styles.callButtonText}>Start Zoom Meeting</Text>
            <View style={styles.fslBadge}><Text style={styles.fslBadgeText}>+ FSL</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={startGoogleMeet}>
            <Ionicons name="videocam" size={22} color="#fff" />
            <Text style={styles.callButtonText}>Start Google Meet</Text>
            <View style={styles.fslBadge}><Text style={styles.fslBadgeText}>+ FSL</Text></View>
          </TouchableOpacity>
        </View>

        {/* Join Meeting */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Join Meeting</Text>
          <TextInput
            style={styles.input}
            placeholder="Meeting ID"
            placeholderTextColor="#aaa"
            value={meetingId}
            onChangeText={setMeetingId}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Password (optional)"
            placeholderTextColor="#aaa"
            value={meetingPassword}
            onChangeText={setMeetingPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.joinButton} onPress={joinZoomMeeting}>
            <Text style={styles.joinButtonText}>Join Zoom Meeting</Text>
          </TouchableOpacity>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <Text style={styles.noteText}>
            {'1. Grant "Display over other apps" in Settings\n'}
            {'2. Tap a call button — FSL overlay starts\n'}
            {'3. Zoom or Meet opens on top\n'}
            {'4. Tap ▶ in the floating widget to translate\n'}
            {'5. Signs are detected via front camera\n'}
            {'6. Drag the widget anywhere on screen\n'}
            {'7. Tap ✕ on the widget or "Stop FSL" to end'}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  topBar: {
    backgroundColor: '#2E3192',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: { marginRight: 12, padding: 8 },
  topBarTitle: { color: '#fff', fontSize: 20, fontWeight: '700', flex: 1 },
  stopOverlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#cc2200',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  stopOverlayText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  header: {
    backgroundColor: '#2E3192',
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  callout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,229,255,0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#00e5ff',
    margin: 10,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  calloutText: { color: '#444', fontSize: 13, flex: 1, lineHeight: 18 },
  calloutBold: { fontWeight: '700', color: '#2E3192' },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E3192',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  callButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', flex: 1 },
  fslBadge: {
    backgroundColor: '#00e5ff',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  fslBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  joinButton: {
    backgroundColor: '#2E3192',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  joinButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  noteText: { fontSize: 14, color: '#666', lineHeight: 24 },
});