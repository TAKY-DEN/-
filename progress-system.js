// نظام تتبع التقدم المشترك بين جميع صفحات الموقع
// Compatible with window.progressSystem.toggleSave() calls
class ProgressSystem {
    constructor() {
        this.storageKey = 'englishCourseProgress';
        this.progress = this.loadProgress();
        this.initializeSystem();
    }

    // تحميل البيانات المحفوظة
    loadProgress() {
        const saved = localStorage.getItem(this.storageKey);
        return saved ? JSON.parse(saved) : {};
    }

    // حفظ البيانات
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        this.updateProgressDisplay();
    }

    // تهيئة النظام
    initializeSystem() {
        this.addProgressButtons();
        this.updateProgressDisplay();
        this.addProgressStyles();
    }

    // إضافة أزرار الحفظ لجميع الصفوف
    addProgressButtons() {
        const tables = document.querySelectorAll('.vocabulary-table, .sentences-table');
        
        tables.forEach(table => {
            // إضافة عمود الحفظ للرأس
            const headerRow = table.querySelector('thead tr');
            if (headerRow && !headerRow.querySelector('.progress-header')) {
                const progressHeader = document.createElement('th');
                progressHeader.className = 'progress-header';
                progressHeader.innerHTML = '📊 الحفظ';
                headerRow.appendChild(progressHeader);
            }

            // إضافة أزرار الحفظ للصفوف
            const bodyRows = table.querySelectorAll('tbody tr');
            bodyRows.forEach((row, index) => {
                if (!row.querySelector('.progress-cell')) {
                    const progressCell = document.createElement('td');
                    progressCell.className = 'progress-cell';
                    
                    const pageType = this.getPageType();
                    const level = this.getLevel();
                    const itemId = `${level}-${pageType}-${index}`;
                    
                    const isCompleted = this.isItemCompleted(level, pageType, index);
                    
                    progressCell.innerHTML = `
                        <button class="progress-btn ${isCompleted ? 'completed' : ''}" 
                                onclick="progressSystem.toggleProgress('${level}', '${pageType}', ${index})"
                                data-item-id="${itemId}">
                            ${isCompleted ? '✅ محفوظ' : '⭕ حفظ'}
                        </button>
                    `;
                    
                    row.appendChild(progressCell);
                    
                    // تحديث لون الصف إذا كان محفوظاً
                    if (isCompleted) {
                        row.classList.add('completed-row');
                    }
                }
            });
        });
    }

    // تبديل حالة الحفظ (الدالة الجديدة)
    toggleSave(type, level, itemId, itemText) {
        // Convert to old format for compatibility
        this.toggleProgress(level, type, itemId);
    }
    
    // تبديل حالة الحفظ (الدالة القديمة)
    toggleProgress(level, type, index) {
        if (!this.progress[level]) this.progress[level] = {};
        if (!this.progress[level][type]) this.progress[level][type] = {};
        
        this.progress[level][type][index] = !this.progress[level][type][index];
        
        const button = document.querySelector(`[data-item-id="${level}-${type}-${index}"]`);
        const row = button.closest('tr');
        
        if (this.progress[level][type][index]) {
            button.innerHTML = '✅ محفوظ';
            button.classList.add('completed');
            row.classList.add('completed-row');
            this.showSuccessMessage('تم حفظ العنصر بنجاح! 🎉');
        } else {
            button.innerHTML = '⭕ حفظ';
            button.classList.remove('completed');
            row.classList.remove('completed-row');
            this.showSuccessMessage('تم إلغاء الحفظ');
        }
        
        this.saveProgress();
    }

    // التحقق من حالة العنصر
    isItemCompleted(level, type, index) {
        return this.progress[level] && 
               this.progress[level][type] && 
               this.progress[level][type][index];
    }

    // الحصول على نوع الصفحة
    getPageType() {
        const url = window.location.pathname;
        if (url.includes('vocabulary')) return 'vocab';
        if (url.includes('sentences')) return 'sentences';
        return 'unknown';
    }

    // الحصول على المستوى
    getLevel() {
        const url = window.location.pathname;
        if (url.includes('a1')) return 'a1';
        if (url.includes('a2')) return 'a2';
        if (url.includes('b1')) return 'b1';
        if (url.includes('b2')) return 'b2';
        return 'unknown';
    }

    // تحديث عرض التقدم
    updateProgressDisplay() {
        // إضافة شريط التقدم في أعلى الصفحة
        this.addProgressBar();
        
        // تحديث الإحصائيات إذا كانت موجودة
        this.updateStats();
    }

    // إضافة شريط التقدم
    addProgressBar() {
        if (document.querySelector('.page-progress-bar')) return;
        
        const level = this.getLevel();
        const type = this.getPageType();
        
        if (level === 'unknown' || type === 'unknown') return;
        
        const totalItems = document.querySelectorAll('.vocabulary-table tbody tr, .sentences-table tbody tr').length;
        const completedItems = this.progress[level] && this.progress[level][type] ? 
            Object.values(this.progress[level][type]).filter(Boolean).length : 0;
        
        const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
        
        const progressBarHTML = `
            <div class="page-progress-bar">
                <div class="progress-info">
                    <span class="progress-text">التقدم: ${completedItems}/${totalItems} (${percentage}%)</span>
                    <a href="progress-tracker.html" class="progress-link">📊 عرض التقدم الكامل</a>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        const container = document.querySelector('.vocabulary-container, .sentences-container');
        if (container) {
            container.insertAdjacentHTML('afterbegin', progressBarHTML);
        }
    }

    // تحديث الإحصائيات
    updateStats() {
        // هذه الدالة ستُستخدم في صفحة التقدم
        const stats = this.calculateStats();
        
        // إرسال حدث للصفحات الأخرى
        window.dispatchEvent(new CustomEvent('progressUpdated', { detail: stats }));
    }

    // حساب الإحصائيات
    calculateStats() {
        const levels = ['a1', 'a2', 'b1', 'b2'];
        const types = ['vocab', 'sentences'];
        
        let totalItems = 0;
        let completedItems = 0;
        let levelStats = {};
        
        levels.forEach(level => {
            levelStats[level] = { vocab: 0, sentences: 0, total: 0, completed: 0 };
            
            types.forEach(type => {
                // هذه الأرقام يجب أن تتطابق مع البيانات الفعلية
                const levelTotals = {
                    a1: { vocab: 50, sentences: 20 },
                    a2: { vocab: 50, sentences: 20 },
                    b1: { vocab: 50, sentences: 20 },
                    b2: { vocab: 50, sentences: 20 }
                };
                
                const total = levelTotals[level][type];
                const completed = this.progress[level] && this.progress[level][type] ? 
                    Object.values(this.progress[level][type]).filter(Boolean).length : 0;
                
                levelStats[level][type] = completed;
                levelStats[level].total += total;
                levelStats[level].completed += completed;
                
                totalItems += total;
                completedItems += completed;
            });
        });
        
        return {
            total: totalItems,
            completed: completedItems,
            percentage: Math.round((completedItems / totalItems) * 100),
            levels: levelStats
        };
    }

    // إضافة الأنماط
    addProgressStyles() {
        if (document.querySelector('#progress-styles')) return;
        
        const styles = `
            <style id="progress-styles">
                .page-progress-bar {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    margin-bottom: 20px;
                    border-radius: 10px;
                }
                
                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                }
                
                .progress-text {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                .progress-link {
                    color: white;
                    text-decoration: none;
                    background: rgba(255,255,255,0.2);
                    padding: 5px 15px;
                    border-radius: 15px;
                    font-size: 14px;
                    transition: all 0.3s ease;
                }
                
                .progress-link:hover {
                    background: rgba(255,255,255,0.3);
                    transform: translateY(-1px);
                }
                
                .progress-bar-bg {
                    background: rgba(255,255,255,0.3);
                    height: 8px;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-bar-fill {
                    background: white;
                    height: 100%;
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }
                
                .progress-btn {
                    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 12px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                    min-width: 80px;
                }
                
                .progress-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(255,107,107,0.4);
                }
                
                .progress-btn.completed {
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                }
                
                .progress-btn.completed:hover {
                    box-shadow: 0 5px 15px rgba(76,175,80,0.4);
                }
                
                .completed-row {
                    background-color: #d4edda !important;
                    border-left: 4px solid #28a745;
                }
                
                .completed-row:hover {
                    background-color: #c3e6cb !important;
                }
                
                .progress-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                    color: white !important;
                    text-align: center;
                }
                
                .progress-cell {
                    text-align: center;
                    vertical-align: middle;
                }
                
                .success-message {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 25px;
                    font-weight: bold;
                    z-index: 9999;
                    box-shadow: 0 5px 15px rgba(76,175,80,0.4);
                    animation: slideDown 0.3s ease;
                }
                
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
                
                @media (max-width: 768px) {
                    .progress-info {
                        flex-direction: column;
                        gap: 10px;
                    }
                    
                    .progress-btn {
                        padding: 6px 12px;
                        font-size: 11px;
                        min-width: 70px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // إظهار رسالة النجاح
    showSuccessMessage(message) {
        // إزالة الرسالة السابقة إن وجدت
        const existingMessage = document.querySelector('.success-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'success-message';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        // إزالة الرسالة بعد 3 ثوان
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // إعادة تعيين التقدم
    resetProgress() {
        if (confirm('هل أنت متأكد من إعادة تعيين جميع البيانات؟ سيتم فقدان جميع التقدم المحفوظ.')) {
            this.progress = {};
            this.saveProgress();
            location.reload();
        }
    }

    // تصدير التقدم
    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `english_course_progress_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }
}

// تهيئة النظام عند تحميل الصفحة
let progressSystem;

document.addEventListener('DOMContentLoaded', function() {
    progressSystem = new ProgressSystem();
});

// دوال مساعدة للاستخدام في الصفحات الأخرى
function getProgressStats() {
    return progressSystem ? progressSystem.calculateStats() : null;
}

function resetAllProgress() {
    if (progressSystem) {
        progressSystem.resetProgress();
    }
}

function exportProgressData() {
    if (progressSystem) {
        progressSystem.exportProgress();
    }
}



// Add scroll progress bar
function addScrollProgressBar() {
    const container = document.querySelector('.progress-container');
    if (!container) return;
    
    // Create scroll progress element
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    scrollProgress.innerHTML = `
        <div class="scroll-progress-text">📜 التقدم في القراءة: <span id="scroll-percent">0</span>%</div>
        <div class="scroll-progress-bar">
            <div class="scroll-progress-fill" id="scroll-fill"></div>
        </div>
    `;
    container.appendChild(scrollProgress);
    
    // Update scroll progress on scroll
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        document.getElementById('scroll-percent').textContent = Math.round(progress);
        document.getElementById('scroll-fill').style.width = progress + '%';
    });
}

// Call on page load
window.addEventListener('DOMContentLoaded', addScrollProgressBar);
