import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import * as Speech from 'expo-speech';
import Voice from 'react-native-voice';
import { Mic, MicOff } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VoiceScreen() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [currentColor, setCurrentColor] = useState('white');
  const [error, setError] = useState<string | null>(null);
  const [isVoiceAvailable, setIsVoiceAvailable] = useState(false);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize Voice module
    const initVoice = async () => {
      try {
        // For web platform, Voice might not be available
        if (Platform.OS === 'web') {
          setIsVoiceAvailable(false);
          setError('Voice recognition is not supported on web platforms.');
          return;
        }
        
        // Initialize Voice
        if (Voice) {
          const available = await Voice.isAvailable();
          console.log('Voice module available:', available);
          setIsVoiceAvailable(available);
          
          // Set up event listeners
          Voice.onSpeechResults = onSpeechResults;
          Voice.onSpeechError = onSpeechError;
        } else {
          throw new Error('Voice module is not available.');
        }
      } catch (e) {
        console.error('Voice recognition not available:', e);
        setIsVoiceAvailable(false);
        setError('Voice recognition is not available on this device.');
      }
    };
    
    initVoice();
    
    // Clean up
    return () => {
      if (Voice) {
        Voice.destroy().then(() => {
          Voice.removeAllListeners();
        }).catch(e => {
          console.error('Error destroying Voice:', e);
        });
      }
      
      // Clear any existing timer when component unmounts
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // Effect to handle color reset timer
  useEffect(() => {
    // Only set a timer if the color is not white
    if (currentColor !== 'white') {
      // Clear any existing timer first
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
      
      // Set a new timer to reset color after 1 minute (60000 ms)
      resetTimerRef.current = setTimeout(() => {
        setCurrentColor('white');
        setRecognizedText('');
        speakText('Returning to initial state');
      }, 60000);
    }
    
    // Clean up timer if component unmounts or color changes
    return () => {
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, [currentColor]);

  // Speech recognition handlers
  function onSpeechResults(e: any) {
    if (e.value && e.value.length > 0) {
      const recognizedText = e.value[0].toLowerCase();
      setRecognizedText(recognizedText);
      
      if (recognizedText.includes('blue')) {
        setCurrentColor('blue');
        speakText('Here is the blue screen');
      } else if (recognizedText.includes('red')) {
        setCurrentColor('red');
        speakText('Here is the red screen');
      }
    }
  }

  function onSpeechError(e: any) {
    console.error('Speech recognition error:', e);
    setError(`Error: ${e.error?.message || 'Speech recognition failed'}`);
    setIsListening(false);
  }

  // Text-to-speech function
  const speakText = async (text: string) => {
    try {
      await Speech.speak(text, {
        language: 'en',
        pitch: 1.0,
        rate: 0.9,
      });
    } catch (e) {
      console.error('Error with speech synthesis:', e);
      setError('Could not speak the text. Please try again.');
    }
  };

  const startListening = async () => {
    setError(null);
    
    if (!isVoiceAvailable) {
      setError('Voice recognition is not available on this platform.');
      return;
    }
    
    try {
      console.log('Starting voice recognition...');
      await Voice.start('en-US');
      setIsListening(true);
      console.log('Voice recognition started');
    } catch (e: any) {
      console.error('Error starting voice recognition:', e);
      setError(`Couldn't start listening: ${e.message || 'Unknown error'}`);
      
      if (Platform.OS === 'web') {
        Alert.alert(
          'Platform Not Supported',
          'Voice recognition is not supported on web. Please try on a mobile device.'
        );
      }
    }
  };

  const stopListening = async () => {
    if (!isVoiceAvailable) return;
    
    try {
      console.log('Stopping voice recognition...');
      await Voice.stop();
      setIsListening(false);
      console.log('Voice recognition stopped');
    } catch (e) {
      console.error('Error stopping voice recognition:', e);
    }
  };

  const toggleListening = () => {
    console.log('Toggling listening state...');
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Calculate remaining time for reset (in seconds)
  const getRemainingTime = () => {
    if (currentColor === 'white' || !resetTimerRef.current) return null;
    
    // This is a simplified way to show a countdown - in a real app you might want to use a more precise method
    return Math.round(60 - ((Date.now() - (resetTimerRef.current as any)._idleStart) / 1000));
  };
  
  const remainingTime = getRemainingTime();

  return (
    <View style={[styles.container, { backgroundColor: currentColor }]}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>IHearYou</Text>
          
          <View style={styles.instructionContainer}>
            <Text style={styles.instruction}>Say "Blue" or "Red"</Text>
            {recognizedText ? (
              <Text style={styles.recognizedText}>Heard: "{recognizedText}"</Text>
            ) : null}
            
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}
            
            {currentColor !== 'white' && (
              <Text style={styles.timerText}>
                Screen will reset in {remainingTime || 60} seconds
              </Text>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.micButton,
              isListening ? styles.micButtonActive : null
            ]}
            onPress={toggleListening}
            activeOpacity={0.7}
          >
            {isListening ? (
              <MicOff size={32} color="white" />
            ) : (
              <Mic size={32} color="white" />
            )}
          </TouchableOpacity>
          
          <Text style={styles.statusText}>
            {isListening ? 'Listening...' : 'Tap to start listening'}
          </Text>
          
          {currentColor !== 'white' && (
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={() => {
                setCurrentColor('white');
                setRecognizedText('');
                speakText('Returning to initial state');
                if (resetTimerRef.current) {
                  clearTimeout(resetTimerRef.current);
                  resetTimerRef.current = null;
                }
              }}
            >
              <Text style={styles.resetButtonText}>Reset Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    transition: 'background-color 0.5s ease',
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    fontFamily: 'Arial',
  },
  micButton: {
    
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    maxWidth: 300,
  },
  instruction: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },
  recognizedText: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
  },
  timerText: {
    fontSize: 14,
    marginTop: 10,
    color: '#007AFF',
    fontWeight: '500',
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#FF3B30',
    marginTop: 10,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#007AFF',
     // Change the color here
    borderRadius: 8,
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});