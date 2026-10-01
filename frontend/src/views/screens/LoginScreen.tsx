import { Image, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { styles } from './LoginScreen.styles';

export default function LoginScreen() {
  const handleLogin = () => {
    router.push('/login');
  };

  const handleSignUp = () => {
    router.push('/register');
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/siya-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Hello, Welcome!</Text>

        <Text style={styles.description}>
          Welcome to Siya Top platform to Save Together, Borrow Smarter,
          Grow Together
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.loginButton}
          onPress={handleLogin}
        >
          <Text style={styles.loginButtonText}>LOGIN</Text>
        </Pressable>

        <Pressable
          style={styles.signUpButton}
          onPress={handleSignUp}
        >
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        </Pressable>
      </View>
    </View>
  );
}