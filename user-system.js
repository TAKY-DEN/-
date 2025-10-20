
// نظام المستخدمين البسيط
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.initializeSystem();
    }

    loadUsers() {
        const saved = localStorage.getItem('englishCourseUsers');
        return saved ? JSON.parse(saved) : {};
    }

    saveUsers() {
        localStorage.setItem('englishCourseUsers', JSON.stringify(this.users));
    }

    initializeSystem() {
        this.checkLoginStatus();
        this.addLoginInterface();
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentEnglishUser');
        if (savedUser) {
            this.currentUser = savedUser;
            this.showUserInterface();
        } else {
            this.showLoginInterface();
        }
    }

    showLoginInterface() {
        const loginHTML = `
            <div id="loginModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%;">
                    <h2 style="text-align: center; color: #667eea; margin-bottom: 20px;">تسجيل الدخول</h2>
                    <div style="margin-bottom: 15px;">
                        <input type="email" id="userEmail" placeholder="البريد الإلكتروني" 
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="margin-bottom: 15px;">
                        <input type="password" id="userPassword" placeholder="كلمة المرور" 
                               style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    </div>
                    <div style="text-align: center;">
                        <button onclick="userSystem.login()" style="background: #667eea; color: white; 
                                padding: 10px 20px; border: none; border-radius: 5px; margin: 5px;">دخول</button>
                        <button onclick="userSystem.register()" style="background: #28a745; color: white; 
                                padding: 10px 20px; border: none; border-radius: 5px; margin: 5px;">تسجيل جديد</button>
                    </div>
                    <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #666;">
                        البيانات محفوظة محلياً في متصفحك فقط
                    </p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loginHTML);
    }

    login() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        
        if (!email || !password) {
            alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        
        if (this.users[email] && this.users[email].password === password) {
            this.currentUser = email;
            localStorage.setItem('currentEnglishUser', email);
            document.getElementById('loginModal').remove();
            this.showUserInterface();
            location.reload();
        } else {
            alert('بيانات خاطئة');
        }
    }

    register() {
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;
        
        if (!email || !password) {
            alert('يرجى إدخال البريد الإلكتروني وكلمة المرور');
            return;
        }
        
        if (this.users[email]) {
            alert('هذا البريد مسجل مسبقاً');
            return;
        }
        
        this.users[email] = {
            password: password,
            registeredAt: new Date().toISOString(),
            progress: {}
        };
        
        this.saveUsers();
        this.currentUser = email;
        localStorage.setItem('currentEnglishUser', email);
        document.getElementById('loginModal').remove();
        this.showUserInterface();
        location.reload();
    }

    showUserInterface() {
        // إضافة شريط المستخدم
        const userBarHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; background: #667eea; color: white; 
                 padding: 10px; z-index: 1000; display: flex; justify-content: space-between; align-items: center;">
                <span>مرحباً: ${this.currentUser}</span>
                <button onclick="userSystem.logout()" style="background: rgba(255,255,255,0.2); 
                        color: white; border: none; padding: 5px 15px; border-radius: 15px;">خروج</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', userBarHTML);
        document.body.style.paddingTop = '50px';
    }

    logout() {
        localStorage.removeItem('currentEnglishUser');
        location.reload();
    }

    getUserProgress() {
        if (!this.currentUser) return {};
        
        const userKey = `englishCourseProgress_${this.currentUser}`;
        const saved = localStorage.getItem(userKey);
        return saved ? JSON.parse(saved) : {};
    }

    saveUserProgress(progress) {
        if (!this.currentUser) return;
        
        const userKey = `englishCourseProgress_${this.currentUser}`;
        localStorage.setItem(userKey, JSON.stringify(progress));
    }
}

// تهيئة النظام
let userSystem;
document.addEventListener('DOMContentLoaded', function() {
    userSystem = new UserSystem();
});
