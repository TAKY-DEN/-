// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAsTWlgkd8QEtzQe07Anfp0Zv1zpvbyMc",
  authDomain: "english-course-84db1.firebaseapp.com",
  projectId: "english-course-84db1",
  storageBucket: "english-course-84db1.firebasestorage.app",
  messagingSenderId: "367107232825",
  appId: "1:367107232825:web:ff7c226b4f465f288fe9e8"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

console.log('Firebase initialized successfully');

