import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useUser } from '../context/_UserContext';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, setUserName, setUserEmail, setProfileImage: setContextProfileImage, setUserBio } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ImagePicker = await import('expo-image-picker');
        if (ImagePicker && ImagePicker.requestMediaLibraryPermissionsAsync) {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(status === 'granted');
        } else {
          setHasGalleryPermission(false);
        }
      } catch (e) {
        // Native module may be unavailable in this environment (Expo Go mismatch)
        console.warn('expo-image-picker not available', e);
        setHasGalleryPermission(false);
      }
    })();

    // Initialize state from user context
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  const pickProfileImage = async () => {
    if (hasGalleryPermission === false) {
      Alert.alert('Permission required', 'Please allow photo access to select a profile picture.');
      return;
    }

    try {
      const ImagePicker = await import('expo-image-picker');
      if (!ImagePicker || !ImagePicker.launchImageLibraryAsync) {
        Alert.alert('Unavailable', 'Image picker is not available in this environment.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      const uri = (result as any).assets?.[0]?.uri ?? (result as any).uri;
      if (uri) {
        setProfileImage(uri);
        setContextProfileImage(uri);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.warn('Image selection failed or expo-image-picker missing', error);
      Alert.alert('Error', 'Could not open image picker. If you are using a custom dev client, rebuild the app after installing `expo-image-picker`.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setUserName(name);
    setUserEmail(email);
    setUserBio(bio);
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDark ? '#0f172a' : '#f5f5f5' }]}> 
      <View style={[styles.header, { backgroundColor: isDark ? '#111827' : '#2E3192' }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickProfileImage} style={[styles.avatar, { backgroundColor: isDark ? '#0f172a' : '#2E3192' }]}> 
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={60} color="#00e5ff" />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={pickProfileImage} style={styles.changePhotoButton}>
            <Ionicons name="camera" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.changeProfilePictureButton, { backgroundColor: isDark ? '#1f2937' : '#f0f0f0' }]} onPress={pickProfileImage}>
            <Ionicons name="image" size={16} color="#00e5ff" />
            <Text style={[styles.changeProfilePictureButtonText, { color: isDark ? '#e5e7eb' : '#333' }]}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#111827' : '#fff' }]}> 
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Personal Information</Text>

          {isEditing ? (
            <>
              <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#f9f9f9', borderColor: isDark ? '#334155' : '#ddd', color: isDark ? '#e5e7eb' : '#333' }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={isDark ? '#94a3b8' : '#999'}
              />

              <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Email (from registration)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: isDark ? '#1f2937' : '#f9f9f9', borderColor: isDark ? '#334155' : '#ddd', color: isDark ? '#e5e7eb' : '#333' }]}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                placeholderTextColor={isDark ? '#94a3b8' : '#999'}
              />

              <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput, { backgroundColor: isDark ? '#1f2937' : '#f9f9f9', borderColor: isDark ? '#334155' : '#ddd', color: isDark ? '#e5e7eb' : '#333' }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                placeholderTextColor={isDark ? '#94a3b8' : '#999'}
              />

              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: isDark ? '#334155' : '#ddd' }]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={[styles.cancelButtonText, { color: isDark ? '#e5e7eb' : '#666' }]}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Name</Text>
                <Text style={[styles.value, { color: isDark ? '#e5e7eb' : '#333' }]}>{name}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Email</Text>
                <Text style={[styles.value, { color: isDark ? '#e5e7eb' : '#333' }]}>{email}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#666' }]}>Bio</Text>
                <Text style={[styles.value, { color: isDark ? '#e5e7eb' : '#333' }]}>{bio}</Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Ionicons name="pencil" size={18} color="#fff" />
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#111827' : '#fff' }]}> 
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>127</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#666' }]}>Translations</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#666' }]}>Accuracy</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>23</Text>
              <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#666' }]}>Days Active</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: isDark ? '#111827' : '#fff' }]}> 
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>Account</Text>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: isDark ? '#334155' : '#eee' }]}>
            <Ionicons name="shield-checkmark" size={20} color="#00e5ff" />
            <Text style={[styles.menuItemText, { color: isDark ? '#e5e7eb' : '#333' }]}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#ccc'} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: isDark ? '#334155' : '#eee' }]}>
            <Ionicons name="lock-closed" size={20} color="#00e5ff" />
            <Text style={[styles.menuItemText, { color: isDark ? '#e5e7eb' : '#333' }]}>Privacy Settings</Text>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#9ca3af' : '#ccc'} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#00e5ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeProfilePictureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00e5ff',
  },
  changeProfilePictureButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  photoHint: {
    marginTop: 8,
    fontSize: 12,
  },
  section: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
  },
  infoRow: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  editButton: {
    backgroundColor: '#00e5ff',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#2E3192',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00e5ff',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
});