import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  topImage: {
    width: '90%',
    height: 280,
    marginBottom: 15,
  },

  logo: {
    width: 220,
    height: 220,
    marginBottom: 40,
  },

  button: {
    width: '100%',
    height: 56,
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  buttonPressed: {
    opacity: 0.7,
  },
});