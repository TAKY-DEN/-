// نظام حفظ بسيط يعمل مباشرة في المتصفح
(function() {
    'use strict';
    
    // إنشاء كائن عام للنظام
    window.SaveSystem = {
        // حفظ عنصر
        save: function(level, type, index) {
            try {
                // قراءة البيانات الحالية
                let data = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                
                // التأكد من وجود المستوى
                if (!data[level]) {
                    data[level] = {};
                }
                
                // التأكد من وجود النوع
                if (!data[level][type]) {
                    data[level][type] = {};
                }
                
                // تبديل الحالة
                if (data[level][type][index]) {
                    delete data[level][type][index];
                } else {
                    data[level][type][index] = {
                        saved: true,
                        date: new Date().toISOString()
                    };
                }
                
                // حفظ البيانات
                localStorage.setItem('courseProgress', JSON.stringify(data));
                
                // تحديث الواجهة
                this.updateUI(level, type);
                
                return true;
            } catch (e) {
                console.error('خطأ في الحفظ:', e);
                alert('حدث خطأ في الحفظ. الرجاء المحاولة مرة أخرى.');
                return false;
            }
        },
        
        // التحقق من حالة الحفظ
        isSaved: function(level, type, index) {
            try {
                let data = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                return !!(data[level] && data[level][type] && data[level][type][index]);
            } catch (e) {
                return false;
            }
        },
        
        // تحديث واجهة المستخدم
        updateUI: function(level, type) {
            // تحديث جميع الأزرار في الصفحة
            let buttons = document.querySelectorAll('.save-btn');
            buttons.forEach(btn => {
                let btnLevel = btn.getAttribute('data-level');
                let btnType = btn.getAttribute('data-type');
                let btnIndex = btn.getAttribute('data-index');
                
                if (btnLevel === level && btnType === type) {
                    if (this.isSaved(level, type, btnIndex)) {
                        btn.textContent = '✅ محفوظ';
                        btn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                        btn.parentElement.parentElement.style.background = '#d4edda';
                    } else {
                        btn.textContent = '⭕ حفظ';
                        btn.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
                        btn.parentElement.parentElement.style.background = '';
                    }
                }
            });
            
            // تحديث شريط التقدم
            this.updateProgressBar(level, type);
        },
        
        // تحديث شريط التقدم
        updateProgressBar: function(level, type) {
            let buttons = document.querySelectorAll(`.save-btn[data-level="${level}"][data-type="${type}"]`);
            let total = buttons.length;
            let saved = 0;
            
            buttons.forEach(btn => {
                let index = btn.getAttribute('data-index');
                if (this.isSaved(level, type, index)) {
                    saved++;
                }
            });
            
            let percentage = total > 0 ? Math.round((saved / total) * 100) : 0;
            
            // تحديث شريط التقدم إذا كان موجوداً
            let progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = percentage + '%';
                progressBar.textContent = `${saved}/${total} (${percentage}%)`;
            }
            
            // تحديث النص في الأعلى
            let progressText = document.querySelector('.progress-text');
            if (progressText) {
                progressText.textContent = `📊 التقدم في هذه الصفحة: ${saved}/${total} ${percentage}%`;
            }
        },
        
        // تهيئة الصفحة
        init: function(level, type) {
            // تحديث جميع الأزرار عند تحميل الصفحة
            let buttons = document.querySelectorAll('.save-btn');
            buttons.forEach(btn => {
                let btnLevel = btn.getAttribute('data-level');
                let btnType = btn.getAttribute('data-type');
                let btnIndex = btn.getAttribute('data-index');
                
                if (this.isSaved(btnLevel, btnType, btnIndex)) {
                    btn.textContent = '✅ محفوظ';
                    btn.style.background = 'linear-gradient(45deg, #28a745, #20c997)';
                    btn.parentElement.parentElement.style.background = '#d4edda';
                }
            });
            
            // تحديث شريط التقدم
            if (level && type) {
                this.updateProgressBar(level, type);
            }
        },
        
        // الحصول على الإحصائيات
        getStats: function() {
            try {
                let data = JSON.parse(localStorage.getItem('courseProgress') || '{}');
                let stats = {
                    total: 0,
                    byLevel: {}
                };
                
                for (let level in data) {
                    stats.byLevel[level] = {
                        sentences: 0,
                        vocabulary: 0,
                        total: 0
                    };
                    
                    if (data[level].sentences) {
                        stats.byLevel[level].sentences = Object.keys(data[level].sentences).length;
                    }
                    
                    if (data[level].vocabulary) {
                        stats.byLevel[level].vocabulary = Object.keys(data[level].vocabulary).length;
                    }
                    
                    stats.byLevel[level].total = stats.byLevel[level].sentences + stats.byLevel[level].vocabulary;
                    stats.total += stats.byLevel[level].total;
                }
                
                return stats;
            } catch (e) {
                console.error('خطأ في قراءة الإحصائيات:', e);
                return { total: 0, byLevel: {} };
            }
        }
    };
    
    console.log('✅ نظام الحفظ جاهز!');
})();

