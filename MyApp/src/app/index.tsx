import { Image, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/siya3.png')}
        style={styles.topImage}
        resizeMode="contain"
      />

      <View style={styles.spacing} />

      <Image
        source={require('../../assets/images/siya-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topImage: {
    width: '90%',
    height: 280,
  },

  spacing: {
    height: 15,
  },

  logo: {
    width: 220,
    height: 220,
  },
});