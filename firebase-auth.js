// Firebase Authentication and Progress System

class FirebaseProgressSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Listen for auth state changes
        auth.onAuthStateChanged((user) => {
            this.currentUser = user;
            if (user) {
                console.log('User logged in:', user.email);
                this.loadUserProgress();
            } else {
                console.log('User logged out');
            }
        });
    }

    // Register new user
    async register(email, password) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            console.log('User registered:', userCredential.user.email);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    }

    // Login user
    async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('User logged in:', userCredential.user.email);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    // Logout user
    async logout() {
        try {
            await auth.signOut();
            console.log('User logged out');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Save item progress
    async saveItemProgress(level, type, itemId) {
        if (!this.currentUser) {
            console.log('No user logged in, saving to localStorage');
            return this.saveToLocalStorage(level, type, itemId);
        }

        try {
            const userId = this.currentUser.uid;
            const progressRef = db.collection('userProgress').doc(userId);
            
            await progressRef.set({
                [`${level}_${type}_${itemId}`]: true,
                lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log(`Progress saved: ${level} ${type} item ${itemId}`);
            return { success: true };
        } catch (error) {
            console.error('Error saving progress:', error);
            return { success: false, error: error.message };
        }
    }

    // Load user progress
    async loadUserProgress() {
        if (!this.currentUser) {
            return null;
        }

        try {
            const userId = this.currentUser.uid;
            const progressRef = db.collection('userProgress').doc(userId);
            const doc = await progressRef.get();

            if (doc.exists) {
                const progress = doc.data();
                console.log('User progress loaded:', progress);
                return progress;
            } else {
                console.log('No progress found for user');
                return {};
            }
        } catch (error) {
            console.error('Error loading progress:', error);
            return null;
        }
    }

    // Get progress for specific level and type
    async getProgress(level, type) {
        const allProgress = await this.loadUserProgress();
        if (!allProgress) return [];

        const savedItems = [];
        for (const key in allProgress) {
            if (key.startsWith(`${level}_${type}_`)) {
                const itemId = key.split('_')[2];
                savedItems.push(itemId);
            }
        }
        return savedItems;
    }

    // Fallback to localStorage for non-logged-in users
    saveToLocalStorage(level, type, itemId) {
        const key = `englishCourse_${level}_${type}_saved`;
        let saved = JSON.parse(localStorage.getItem(key) || '[]');
        if (!saved.includes(itemId)) {
            saved.push(itemId);
            localStorage.setItem(key, JSON.stringify(saved));
        }
        return { success: true };
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize Firebase Progress System
const firebaseProgress = new FirebaseProgressSystem();

