import { Image, StyleSheet, View } from 'react-native';

export default function TopImage() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/siya3.png')}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 300,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
  },
});

