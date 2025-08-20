import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  FindJob: undefined;
  HireProvider: undefined;
  publish: undefined;
  Formation: undefined;
  Agedant: undefined;
  Stage: undefined;
  Bourse: undefined;
  profile: undefined
  messages: undefined;
  // ... autres écrans
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;