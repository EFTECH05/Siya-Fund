import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 45,

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  logo: {
    width: 125,
    height: 125,
    borderRadius: 62.5,
  },

  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 45,
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 18,
  },

  description: {
    fontSize: 17,
    lineHeight: 27,
    fontWeight: '400',
    color: '#000000',
    textAlign: 'center',
    maxWidth: 350,
  },

  buttonContainer: {
    width: '100%',
    gap: 16,
  },

  loginButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#2E8B57',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  signUpButton: {
    width: '100%',
    height: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E8B57',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  signUpButtonText: {
    color: '#2E8B57',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
});