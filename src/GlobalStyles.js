import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  ContentMask: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    backgroundColor: 'rgba(255,255,255,0.4)'
  },
  TextContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 2,
    paddingRight: 30,
    paddingLeft: 30,
    paddingBottom: 30,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 30,
  },
  BodyText: {
    letterSpacing: 1,
    fontSize: 13,
    lineHeight: 30,
    fontWeight: '300',
    paddingTop: 30
  },
  PageTitle: {
    fontSize: 24,
    color: '#353535',
    letterSpacing: 3,
    fontWeight: '400',
    marginBottom: 12,
  },
  PageTitleUnderline: {
    borderBottomWidth: 3,
    marginBottom: 36,
    borderBottomColor: '#c9bc17'
  }
});