// نظام المستخدمين المحسن والمصحح
class UserSystem {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
        this.initializeSystem();
    }

    loadUsers() {
        try {
            const saved = localStorage.getItem('englishCourseUsers');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('خطأ في تحميل بيانات المستخدمين:', error);
            return {};
        }
    }

    saveUsers() {
        try {
            localStorage.setItem('englishCourseUsers', JSON.stringify(this.users));
        } catch (error) {
            console.error('خطأ في حفظ بيانات المستخدمين:', error);
        }
    }

    initializeSystem() {
        // التأكد من تحميل الصفحة بالكامل قبل التهيئة
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.checkLoginStatus();
            });
        } else {
            this.checkLoginStatus();
        }
    }

    checkLoginStatus() {
        const savedUser = localStorage.getItem('currentEnglishUser');
        if (savedUser && this.users[savedUser]) {
            this.currentUser = savedUser;
            this.showUserInterface();
        } else {
            // إزالة المستخدم المحفوظ إذا لم يعد موجوداً
            localStorage.removeItem('currentEnglishUser');
            this.showLoginInterface();
        }
    }

    showLoginInterface() {
        // إزالة النافذة السابقة إن وجدت
        const existingModal = document.getElementById('loginModal');
        if (existingModal) {
            existingModal.remove();
        }

        const loginHTML = `
            <div id="loginModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; direction: rtl;">
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <h2 style="text-align: center; color: #667eea; margin-bottom: 20px; font-family: 'Cairo', Arial, sans-serif;">🔐 تسجيل الدخول</h2>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #333; font-weight: bold;">البريد الإلكتروني:</label>
                        <input type="email" id="userEmail" placeholder="example@email.com" 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
                               onkeypress="if(event.key==='Enter') userSystemFixed.handleEnterKey()">
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; color: #333; font-weight: bold;">كلمة المرور:</label>
                        <input type="password" id="userPassword" placeholder="••••••••" 
                               style="width: 100%; padding: 12px; border: 2px solid #ddd; border-radius: 8px; font-size: 14px; box-sizing: border-box;"
                               onkeypress="if(event.key==='Enter') userSystemFixed.handleEnterKey()">
                    </div>
                    
                    <div style="text-align: center; margin-bottom: 15px;">
                        <button onclick="userSystemFixed.login()" 
                                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; 
                                padding: 12px 25px; border: none; border-radius: 25px; margin: 5px; cursor: pointer; 
                                font-weight: bold; font-size: 14px; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.transform='translateY(0)'">
                            🔑 دخول
                        </button>
                        
                        <button onclick="userSystemFixed.register()" 
                                style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; 
                                padding: 12px 25px; border: none; border-radius: 25px; margin: 5px; cursor: pointer; 
                                font-weight: bold; font-size: 14px; transition: all 0.3s ease;"
                                onmouseover="this.style.transform='translateY(-2px)'"
                                onmouseout="this.style.transform='translateY(0)'">
                            ✨ تسجيل جديد
                        </button>
                    </div>
                    
                    <div style="text-align: center; margin-top: 15px;">
                        <button onclick="userSystemFixed.skipLogin()" 
                                style="background: #6c757d; color: white; padding: 8px 20px; border: none; 
                                border-radius: 15px; cursor: pointer; font-size: 12px;">
                            ⏭️ تخطي التسجيل (استخدام مؤقت)
                        </button>
                    </div>
                    
                    <p style="text-align: center; margin-top: 15px; font-size: 12px; color: #666; line-height: 1.4;">
                        🔒 البيانات محفوظة محلياً في متصفحك فقط<br>
                        💡 التسجيل يساعدك في حفظ تقدمك
                    </p>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loginHTML);
        
        // التركيز على حقل الإيميل
        setTimeout(() => {
            const emailInput = document.getElementById('userEmail');
            if (emailInput) emailInput.focus();
        }, 100);
    }

    handleEnterKey() {
        const email = document.getElementById('userEmail')?.value;
        const password = document.getElementById('userPassword')?.value;
        
        if (email && password) {
            this.login();
        }
    }

    login() {
        const emailInput = document.getElementById('userEmail');
        const passwordInput = document.getElementById('userPassword');
        
        if (!emailInput || !passwordInput) {
            this.showMessage('خطأ في النظام، يرجى إعادة تحميل الصفحة', 'error');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) {
            this.showMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'warning');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('يرجى إدخال بريد إلكتروني صحيح', 'warning');
            return;
        }
        
        if (this.users[email] && this.users[email].password === password) {
            this.currentUser = email;
            localStorage.setItem('currentEnglishUser', email);
            this.removeLoginModal();
            this.showUserInterface();
            this.showMessage('تم تسجيل الدخول بنجاح! 🎉', 'success');
            
            // إعادة تحميل الصفحة لتطبيق التغييرات
            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            this.showMessage('بيانات خاطئة، يرجى المحاولة مرة أخرى', 'error');
            passwordInput.value = '';
            passwordInput.focus();
        }
    }

    register() {
        const emailInput = document.getElementById('userEmail');
        const passwordInput = document.getElementById('userPassword');
        
        if (!emailInput || !passwordInput) {
            this.showMessage('خطأ في النظام، يرجى إعادة تحميل الصفحة', 'error');
            return;
        }
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email || !password) {
            this.showMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'warning');
            return;
        }
        
        if (!this.isValidEmail(email)) {
            this.showMessage('يرجى إدخال بريد إلكتروني صحيح', 'warning');
            return;
        }
        
        if (password.length < 4) {
            this.showMessage('كلمة المرور يجب أن تكون 4 أحرف على الأقل', 'warning');
            return;
        }
        
        if (this.users[email]) {
            this.showMessage('هذا البريد مسجل مسبقاً، يرجى تسجيل الدخول', 'warning');
            return;
        }
        
        // إنشاء حساب جديد
        this.users[email] = {
            password: password,
            registeredAt: new Date().toISOString(),
            progress: {}
        };
        
        this.saveUsers();
        this.currentUser = email;
        localStorage.setItem('currentEnglishUser', email);
        this.removeLoginModal();
        this.showUserInterface();
        this.showMessage('تم إنشاء الحساب بنجاح! مرحباً بك 🎉', 'success');
        
        // إعادة تحميل الصفحة لتطبيق التغييرات
        setTimeout(() => {
            location.reload();
        }, 1500);
    }

    skipLogin() {
        // استخدام مؤقت بدون تسجيل
        // استخدام معرف ثابت للمستخدمين المؤقتين
        this.currentUser = 'guest_temporary_user';
        localStorage.setItem('currentEnglishUser', this.currentUser);
        this.removeLoginModal();
        this.showUserInterface();
        this.showMessage('تم الدخول كمستخدم مؤقت', 'info');
    }

    removeLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.remove();
        }
    }

    showUserInterface() {
        // إزالة شريط المستخدم السابق إن وجد
        const existingBar = document.getElementById('userBar');
        if (existingBar) {
            existingBar.remove();
        }

        const displayName = this.currentUser.startsWith('guest_') ? 'مستخدم مؤقت' : this.currentUser;
        
        const userBarHTML = `
            <div id="userBar" style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                 color: white; padding: 10px 20px; z-index: 1000; display: flex; justify-content: space-between; 
                 align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1); direction: rtl;">
                <span style="font-weight: bold;">👋 مرحباً: ${displayName}</span>
                <div>
                    <button onclick="userSystemFixed.showProfile()" 
                            style="background: rgba(255,255,255,0.2); color: white; border: none; 
                            padding: 5px 15px; border-radius: 15px; margin-left: 10px; cursor: pointer; font-size: 12px;">
                        👤 الملف الشخصي
                    </button>
                    <button onclick="userSystemFixed.logout()" 
                            style="background: rgba(255,255,255,0.2); color: white; border: none; 
                            padding: 5px 15px; border-radius: 15px; cursor: pointer; font-size: 12px;">
                        🚪 خروج
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', userBarHTML);
        document.body.style.paddingTop = '50px';
    }

    showProfile() {
        const isGuest = this.currentUser.startsWith('guest_');
        const registrationDate = this.users[this.currentUser]?.registeredAt;
        
        let profileContent = `
            <h3>👤 الملف الشخصي</h3>
            <p><strong>المستخدم:</strong> ${isGuest ? 'مستخدم مؤقت' : this.currentUser}</p>
        `;
        
        if (!isGuest && registrationDate) {
            profileContent += `<p><strong>تاريخ التسجيل:</strong> ${new Date(registrationDate).toLocaleDateString('ar-SA')}</p>`;
        }
        
        if (isGuest) {
            profileContent += `
                <p style="color: #ff6b6b; font-weight: bold;">⚠️ أنت تستخدم حساباً مؤقتاً</p>
                <p>لحفظ تقدمك بشكل دائم، يرجى إنشاء حساب جديد</p>
                <button onclick="userSystemFixed.logout(); userSystemFixed.showLoginInterface();" 
                        style="background: #28a745; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">
                    إنشاء حساب دائم
                </button>
            `;
        }
        
        this.showModal('الملف الشخصي', profileContent);
    }

    showModal(title, content) {
        const modalHTML = `
            <div id="profileModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                 background: rgba(0,0,0,0.8); z-index: 10001; display: flex; align-items: center; justify-content: center; direction: rtl;">
                <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
                    <h2 style="color: #667eea; margin-bottom: 20px;">${title}</h2>
                    <div>${content}</div>
                    <div style="text-align: center; margin-top: 20px;">
                        <button onclick="document.getElementById('profileModal').remove()" 
                                style="background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    logout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            localStorage.removeItem('currentEnglishUser');
            location.reload();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type = 'info') {
        // إزالة الرسالة السابقة إن وجدت
        const existingMessage = document.getElementById('systemMessage');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        const messageDiv = document.createElement('div');
        messageDiv.id = 'systemMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-weight: bold;
            z-index: 10002;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideDown 0.3s ease;
            direction: rtl;
            text-align: center;
            max-width: 90%;
        `;
        
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);
        
        // إزالة الرسالة بعد 4 ثوان
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 4000);
    }

    // دوال للتكامل مع نظام التقدم
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

// إنشاء النظام وتهيئته
let userSystemFixed;

// التأكد من تحميل الصفحة قبل التهيئة
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        userSystemFixed = new UserSystem();
    });
} else {
    userSystemFixed = new UserSystem();
}

// إضافة الأنماط المطلوبة
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(styleSheet);

