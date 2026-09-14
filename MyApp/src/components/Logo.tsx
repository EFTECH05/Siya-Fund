import { Image, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <Image
      source={require('../../assets/images/siya-logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 220,
    height: 220,
  },
});



