document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available
    if (typeof firebase === 'undefined' || typeof firebase.auth === 'undefined' || typeof firebase.firestore === 'undefined') {
        console.error('Firebase is not properly configured or loaded.');
        return;
    }

    const auth = firebase.auth();
    const db = firebase.firestore();
    let currentUser = null;

    // UI Elements
    const loginModal = document.getElementById('loginModal');
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const skipButton = document.getElementById('skipButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const userDisplay = document.getElementById('userDisplay'); // To show logged-in user

    // Show login modal on page load if not logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            currentUser = user;
            if (loginModal) loginModal.style.display = 'none';
            if (userDisplay) userDisplay.textContent = `مرحباً, ${user.email}`;
            console.log('User is logged in:', user.email);
            // Load progress from Firebase
            loadProgressFromFirebase();
        } else {
            currentUser = null;
            if (loginModal) loginModal.style.display = 'flex';
            if (userDisplay) userDisplay.textContent = '';
            console.log('User is logged out.');
        }
    });

    // --- Event Listeners ---
    if (loginButton) {
        loginButton.addEventListener('click', async () => {
            try {
                await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
            } catch (error) {
                alert(`Login failed: ${error.message}`);
            }
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', async () => {
            try {
                await auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value);
            } catch (error) {
                alert(`Registration failed: ${error.message}`);
            }
        });
    }

    if (skipButton) {
        skipButton.addEventListener('click', () => {
            loginModal.style.display = 'none';
            console.log('User skipped login. Using local storage.');
        });
    }

    // --- Progress Saving Logic ---
    window.saveItemProgress = async (level, type, itemId) => {
        if (currentUser) {
            // Logged in: Save to Firebase
            const userProgressRef = db.collection('userProgress').doc(currentUser.uid);
            try {
                await userProgressRef.set({
                    [`${level}_${type}_${itemId}`]: true
                }, { merge: true });
                console.log(`Saved to Firebase: ${level}_${type}_${itemId}`);
                updateButtonUI(level, type, itemId, true);
            } catch (error) {
                console.error('Error saving to Firebase:', error);
            }
        } else {
            // Not logged in: Save to localStorage
            let progress = JSON.parse(localStorage.getItem('englishCourseProgress') || '{}');
            if (!progress[level]) progress[level] = {};
            if (!progress[level][type]) progress[level][type] = {};
            progress[level][type][itemId] = true;
            localStorage.setItem('englishCourseProgress', JSON.stringify(progress));
            console.log(`Saved to localStorage: ${level}_${type}_${itemId}`);
            updateButtonUI(level, type, itemId, true);
        }
    };

    const loadProgressFromFirebase = async () => {
        if (!currentUser) return;
        const doc = await db.collection('userProgress').doc(currentUser.uid).get();
        if (doc.exists) {
            const firebaseProgress = doc.data();
            // Apply progress to UI
            Object.keys(firebaseProgress).forEach(key => {
                const [level, type, itemId] = key.split('_');
                updateButtonUI(level, type, itemId, true);
            });
        }
    };

    const loadProgressFromLocalStorage = () => {
        const progress = JSON.parse(localStorage.getItem('englishCourseProgress') || '{}');
        Object.keys(progress).forEach(level => {
            Object.keys(progress[level]).forEach(type => {
                Object.keys(progress[level][type]).forEach(itemId => {
                    updateButtonUI(level, type, itemId, true);
                });
            });
        });
    };

    // --- UI Update Logic ---
    const updateButtonUI = (level, type, itemId, isSaved) => {
        const button = document.querySelector(`button[data-level='${level}'][data-type='${type}'][data-item-id='${itemId}']`);
        if (button) {
            if (isSaved) {
                button.textContent = '✅ محفوظ';
                button.classList.add('saved');
                button.closest('tr').style.backgroundColor = '#e8f5e9'; // Light green
            } else {
                button.textContent = '⭕ حفظ';
                button.classList.remove('saved');
                button.closest('tr').style.backgroundColor = '';
            }
        }
    };

    // Initial load
    if (!currentUser) {
        loadProgressFromLocalStorage();
    }
});

