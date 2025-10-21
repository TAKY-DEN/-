// Enhanced Progress System with Firebase Integration
class ProgressSystemFirebase extends ProgressSystem {
    constructor() {
        super();
        this.firebaseReady = false;
        this.initFirebase();
    }

    async initFirebase() {
        // Wait for Firebase to be ready
        if (typeof firebaseProgress !== 'undefined') {
            this.firebaseReady = true;
            console.log('Firebase Progress System ready');
            
            // Load progress from Firebase if user is logged in
            if (firebaseProgress.isLoggedIn()) {
                await this.syncWithFirebase();
            }
        } else {
            console.log('Firebase not available, using localStorage only');
        }
    }

    async syncWithFirebase() {
        if (!this.firebaseReady || !firebaseProgress.isLoggedIn()) {
            return;
        }

        try {
            const firebaseData = await firebaseProgress.loadUserProgress();
            if (firebaseData) {
                // Merge Firebase data with local data
                this.mergeProgress(firebaseData);
                console.log('Progress synced with Firebase');
            }
        } catch (error) {
            console.error('Error syncing with Firebase:', error);
        }
    }

    mergeProgress(firebaseData) {
        // Convert Firebase flat structure to our nested structure
        for (const key in firebaseData) {
            if (key.startsWith('a1_') || key.startsWith('a2_') || 
                key.startsWith('b1_') || key.startsWith('b2_') ||
                key.startsWith('c1_') || key.startsWith('c2_')) {
                
                const parts = key.split('_');
                const level = parts[0];
                const type = parts[1];
                const itemId = parts[2];

                if (this.progress[type] && this.progress[type][level]) {
                    this.progress[type][level][itemId] = true;
                }
            }
        }
        this.saveProgress();
    }

    async saveItem(level, type, itemId) {
        // Save to local storage (existing functionality)
        if (!this.progress[type]) {
            this.progress[type] = {};
        }
        if (!this.progress[type][level]) {
            this.progress[type][level] = {};
        }
        
        this.progress[type][level][itemId] = true;
        this.progress.totalSaved = (this.progress.totalSaved || 0) + 1;
        this.saveProgress();

        // Save to Firebase if available and user is logged in
        if (this.firebaseReady && firebaseProgress.isLoggedIn()) {
            try {
                await firebaseProgress.saveItemProgress(level, type, itemId);
                console.log(`Saved to Firebase: ${level} ${type} ${itemId}`);
            } catch (error) {
                console.error('Error saving to Firebase:', error);
            }
        }

        return true;
    }

    isItemSaved(level, type, itemId) {
        if (!this.progress[type] || !this.progress[type][level]) {
            return false;
        }
        return this.progress[type][level][itemId] === true;
    }
}

// Replace the original ProgressSystem with Firebase-enabled version
if (typeof ProgressSystem !== 'undefined') {
    window.progressSystem = new ProgressSystemFirebase();
    console.log('Progress System with Firebase initialized');
}

