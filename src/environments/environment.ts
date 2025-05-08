import { FirebaseOptions } from 'firebase/app';

export const environment = {
  firebaseConfig: process.env['FIREBASE_CONFIG'] as FirebaseOptions,
};
