import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  topImage: {
    width: '100%',
    height: 220,
    marginBottom: 20,
  },
  logo: {
    width: 240,
    height: 120,
    marginBottom: 30,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    backgroundColor: '#0B7A75',
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});

export default function HomeScreen() {
  const handleGetStarted = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/siya3.png')}
        style={styles.topImage}
        resizeMode="contain"
      />

      <Image
        source={require('../../assets/images/siya-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Pressable
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleGetStarted}
      >
        <Text style={styles.buttonText}>GET STARTED</Text>
      </Pressable>
    </View>
  );
}