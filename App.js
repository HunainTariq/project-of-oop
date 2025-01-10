import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Voice from 'react-native-voice'; // Import voice module

const App = () => {
  const [translatedText, setTranslatedText] = useState('');
  const [listening, setListening] = useState(false);

  // Request microphone permission for Android
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message:
              'This app needs access to your microphone to convert speech to text.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission granted');
        } else {
          console.log('Microphone permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  // Voice event listeners
  useEffect(() => {
    requestMicrophonePermission();

    Voice.onSpeechStart = () => setListening(true);
    Voice.onSpeechEnd = () => setListening(false);
    Voice.onSpeechResults = (e) => setTranslatedText(e.value[0]);

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Start listening
  const startListening = async () => {
    try {
      setTranslatedText('');
      await Voice.start('en-US'); // Start speech recognition in English
    } catch (error) {
      console.error('Voice error:', error);
    }
  };

  // Stop listening
  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Stop error:', error);
    }
  };

  // Reset Translation
  const resetTranslation = () => {
    setTranslatedText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Voice to Text Translator</Text>

      <View style={styles.micContainer}>
        <TouchableOpacity
          style={listening ? styles.micButtonActive : styles.micButton}
          onPress={listening ? stopListening : startListening}
        >
          <Image
            source={require('./assets/download.png')} // Replace with your microphone image
            style={styles.micIcon}
          />
        </TouchableOpacity>
        <Text style={styles.listeningText}>
          {listening ? 'Listening...' : 'Tap the microphone to start'}
        </Text>
      </View>

      {/* Output Text */}
      <View style={styles.outputContainer}>
        <TextInput
          style={styles.outputText}
          multiline
          editable={false}
          placeholder="Your text will appear here..."
          value={translatedText}
        />
      </View>

      {/* Reset Button */}
      {translatedText.length > 0 && (
        <TouchableOpacity style={styles.resetButton} onPress={resetTranslation}>
          <Text style={styles.resetText}>Clear</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  micButton: {
    backgroundColor: '#007bff',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  micButtonActive: {
    backgroundColor: '#28a745',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  micIcon: {
    width: 50,
    height: 50,
    tintColor: '#fff',
  },
  listeningText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  outputContainer: {
    width: '100%',
    marginVertical: 20,
  },
  outputText: {
    minHeight: 100,
    padding: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  resetText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
