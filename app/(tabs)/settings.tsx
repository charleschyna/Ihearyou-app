import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Info, Volume2, Mic, Palette } from 'lucide-react-native';

export default function SettingsScreen() {
  const [voiceEnabled, setVoiceEnabled] = React.useState(true);
  const [audioFeedback, setAudioFeedback] = React.useState(true);
  const [highContrast, setHighContrast] = React.useState(false);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Recognition</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Mic size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.settingText}>Enable Voice Recognition</Text>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={setVoiceEnabled}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Volume2 size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.settingText}>Audio Feedback</Text>
            </View>
            <Switch
              value={audioFeedback}
              onValueChange={setAudioFeedback}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Palette size={22} color="#007AFF" style={styles.icon} />
              <Text style={styles.settingText}>High Contrast Mode</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: '#D1D1D6', true: '#4CD964' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.aboutContainer}>
            <Info size={22} color="#007AFF" style={styles.icon} />
            <View>
              <Text style={styles.appName}>IHearYou</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                A voice-controlled app that responds to color commands.
                Say "Blue" or "Red" to change the screen
                color.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1C1C1E',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1C1C1E',
  },
  aboutContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  appVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
  },
});