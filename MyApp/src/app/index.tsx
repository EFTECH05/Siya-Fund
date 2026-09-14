import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TopImage from '@/components/TopImage';
import Logo from '@/components/Logo';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Top image */}
        <TopImage />

        {/* Small space */}
        <View style={styles.spacing} />

        {/* Siya-Fund logo */}
        <Logo />

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },

  spacing: {
    height: 20,
  },
});