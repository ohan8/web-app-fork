import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

// Your web app's Firebase configuration
// These keys are ok to leave public according to Firebase docs
// Initialize Firebase
const firebase = initializeApp({
  apiKey: 'AIzaSyCJKArKBX02ItsUD1zDJVC6JRA4sho7PTo',
  authDomain: 'urm-app.firebaseapp.com',
  projectId: 'urm-app',
  storageBucket: 'urm-app.appspot.com',
  messagingSenderId: '747878690617',
  appId: '1:747878690617:web:d29679a2961a60f31b82e8',
  measurementId: 'G-3PE6CE9N0H',
});

const storage = getStorage();
const auth = getAuth(firebase);
const functions = getFunctions(firebase);
export { firebase, storage, auth, functions };
