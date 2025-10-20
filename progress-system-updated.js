// نظام تتبع التقدم المحدث والمتكامل
class ProgressSystem {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.progress = this.loadProgress();
        this.initializeSystem();
    }

    getCurrentUser() {
        // التكامل مع نظام المستخدمين
        if (typeof userSystemFixed !== 'undefined' && userSystemFixed.currentUser) {
            return userSystemFixed.currentUser;
        }
        return localStorage.getItem('currentEnglishUser') || 'default_user';
    }

    loadProgress() {
        try {
            const userKey = `englishCourseProgress_${this.currentUser}`;
            const saved = localStorage.getItem(userKey);
            return saved ? JSON.parse(saved) : {
                vocabulary: { a1: {}, a2: {}, b1: {}, b2: {} },
                sentences: { a1: {}, a2: {}, b1: {}, b2: {} },
                lastActivity: null,
                totalSaved: 0
            };
        } catch (error) {
            console.error('خطأ في تحميل التقدم:', error);
            return {
                vocabulary: { a1: {}, a2: {}, b1: {}, b2: {} },
                sentences: { a1: {}, a2: {}, b1: {}, b2: {} },
                lastActivity: null,
                totalSaved: 0
            };
        }
    }

    saveProgress() {
        try {
            const userKey = `englishCourseProgress_${this.currentUser}`;
            this.progress.lastActivity = new Date().toISOString();
            localStorage.setItem(userKey, JSON.stringify(this.progress));
            
            // التكامل مع نظام المستخدمين إذا كان متاحاً
            if (typeof userSystemFixed !== 'undefined' && userSystemFixed.saveUserProgress) {
                userSystemFixed.saveUserProgress(this.progress);
            }
        } catch (error) {
            console.error('خطأ في حفظ التقدم:', error);
        }
    }

    initializeSystem() {
        this.addProgressStyles();
        this.detectCurrentPage();
        this.addProgressBar();
    }

    addProgressStyles() {
        const styles = `
            <style id="progressStyles">
                .progress-button {
                    background: #28a745;
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
                
                .progress-button:hover {
                    background: #218838;
                    transform: translateY(-2px);
                }
                
                .progress-button.saved {
                    background: #6c757d;
                    cursor: default;
                }
                
                .progress-button.saved:hover {
                    transform: none;
                }
                
                .progress-row.saved {
                    background: rgba(40, 167, 69, 0.1) !important;
                    border-left: 4px solid #28a745;
                }
                
                .progress-bar-container {
                    position: fixed;
                    top: 50px;
                    left: 0;
                    right: 0;
                    background: rgba(255, 255, 255, 0.95);
                    padding: 10px 20px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    z-index: 999;
                    direction: rtl;
                    backdrop-filter: blur(10px);
                }
                
                .progress-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 14px;
                    font-weight: bold;
                }
                
                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #28a745, #20c997);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                }
                
                .progress-message {
                    position: fixed;
                    top: 150px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #28a745;
                    color: white;
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                    z-index: 10000;
                    animation: slideDown 0.3s ease;
                    direction: rtl;
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
                    .progress-bar-container {
                        padding: 8px 15px;
                    }
                    
                    .progress-info {
                        font-size: 12px;
                    }
                    
                    .progress-button {
                        padding: 6px 12px;
                        font-size: 11px;
                        min-width: 70px;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        // تحديد نوع الصفحة والمستوى
        if (filename.includes('vocabulary')) {
            this.currentPageType = 'vocabulary';
        } else if (filename.includes('sentences')) {
            this.currentPageType = 'sentences';
        } else {
            return; // ليست صفحة مفردات أو جمل
        }
        
        // تحديد المستوى
        if (filename.includes('a1')) {
            this.currentLevel = 'a1';
        } else if (filename.includes('a2')) {
            this.currentLevel = 'a2';
        } else if (filename.includes('b1')) {
            this.currentLevel = 'b1';
        } else if (filename.includes('b2')) {
            this.currentLevel = 'b2';
        }
        
        if (this.currentPageType && this.currentLevel) {
            this.addSaveButtons();
        }
    }

    addProgressBar() {
        if (!this.currentPageType || !this.currentLevel) return;
        
        const saved = Object.keys(this.progress[this.currentPageType][this.currentLevel]).length;
        const total = this.getTotalItemsOnPage();
        const percentage = total > 0 ? Math.round((saved / total) * 100) : 0;
        
        const progressBarHTML = `
            <div class="progress-bar-container">
                <div class="progress-info">
                    <span>📊 التقدم في هذه الصفحة: ${saved}/${total}</span>
                    <span>${percentage}%</span>
                    <a href="progress-tracker.html" style="color: #667eea; text-decoration: none; font-size: 12px;">
                        📈 عرض الإحصائيات الكاملة
                    </a>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', progressBarHTML);
        document.body.style.paddingTop = '140px';
    }

    getTotalItemsOnPage() {
        const table = document.querySelector('.vocabulary-table, table');
        if (!table) return 0;
        
        const rows = table.querySelectorAll('tbody tr, tr');
        return Math.max(0, rows.length - 1); // طرح صف العناوين
    }

    addSaveButtons() {
        const table = document.querySelector('.vocabulary-table, table');
        if (!table) return;
        
        // إضافة عمود الحفظ للعناوين
        const headerRow = table.querySelector('thead tr, tr:first-child');
        if (headerRow && !headerRow.querySelector('.save-header')) {
            const saveHeader = document.createElement('th');
            saveHeader.className = 'save-header';
            saveHeader.textContent = '📊 الحفظ';
            saveHeader.style.cssText = 'text-align: center; width: 120px;';
            headerRow.appendChild(saveHeader);
        }
        
        // إضافة أزرار الحفظ للصفوف
        const dataRows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
        dataRows.forEach((row, index) => {
            if (row.querySelector('.save-cell')) return; // تجنب التكرار
            
            const itemId = `${this.currentLevel}_${this.currentPageType}_${index}`;
            const isSaved = this.progress[this.currentPageType][this.currentLevel][itemId];
            
            const saveCell = document.createElement('td');
            saveCell.className = 'save-cell';
            saveCell.style.textAlign = 'center';
            
            const saveButton = document.createElement('button');
            saveButton.className = `progress-button ${isSaved ? 'saved' : ''}`;
            saveButton.textContent = isSaved ? '✅ محفوظ' : '⭕ حفظ';
            saveButton.onclick = () => this.toggleSave(itemId, row, saveButton);
            
            saveCell.appendChild(saveButton);
            row.appendChild(saveCell);
            
            // تطبيق تنسيق الصف المحفوظ
            if (isSaved) {
                row.classList.add('progress-row', 'saved');
            }
        });
    }

    toggleSave(itemId, row, button) {
        const isCurrentlySaved = this.progress[this.currentPageType][this.currentLevel][itemId];
        
        if (isCurrentlySaved) {
            // إلغاء الحفظ
            delete this.progress[this.currentPageType][this.currentLevel][itemId];
            button.textContent = '⭕ حفظ';
            button.classList.remove('saved');
            row.classList.remove('saved');
            this.showMessage('تم إلغاء الحفظ');
        } else {
            // حفظ العنصر
            const itemData = this.extractItemData(row);
            this.progress[this.currentPageType][this.currentLevel][itemId] = {
                ...itemData,
                savedAt: new Date().toISOString(),
                level: this.currentLevel,
                type: this.currentPageType
            };
            button.textContent = '✅ محفوظ';
            button.classList.add('saved');
            row.classList.add('progress-row', 'saved');
            this.showMessage('تم الحفظ بنجاح! 🎉');
        }
        
        this.saveProgress();
        this.updateProgressBar();
    }

    extractItemData(row) {
        const cells = row.querySelectorAll('td:not(.save-cell)');
        const data = {};
        
        if (cells.length >= 3) {
            data.english = cells[0]?.textContent?.trim() || '';
            data.arabic = cells[1]?.textContent?.trim() || '';
            data.pronunciation = cells[2]?.textContent?.trim() || '';
        }
        
        return data;
    }

    updateProgressBar() {
        const saved = Object.keys(this.progress[this.currentPageType][this.currentLevel]).length;
        const total = this.getTotalItemsOnPage();
        const percentage = total > 0 ? Math.round((saved / total) * 100) : 0;
        
        const progressInfo = document.querySelector('.progress-info span:first-child');
        const progressFill = document.querySelector('.progress-fill');
        const percentageSpan = document.querySelector('.progress-info span:nth-child(2)');
        
        if (progressInfo) {
            progressInfo.textContent = `📊 التقدم في هذه الصفحة: ${saved}/${total}`;
        }
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (percentageSpan) {
            percentageSpan.textContent = `${percentage}%`;
        }
    }

    showMessage(message) {
        // إزالة الرسالة السابقة
        const existingMessage = document.querySelector('.progress-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'progress-message';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // دوال للوصول من صفحة الإحصائيات
    getOverallStats() {
        const stats = {
            vocabulary: { a1: 0, a2: 0, b1: 0, b2: 0 },
            sentences: { a1: 0, a2: 0, b1: 0, b2: 0 },
            total: 0,
            lastActivity: this.progress.lastActivity
        };
        
        // حساب المفردات المحفوظة
        Object.keys(this.progress.vocabulary).forEach(level => {
            stats.vocabulary[level] = Object.keys(this.progress.vocabulary[level]).length;
            stats.total += stats.vocabulary[level];
        });
        
        // حساب الجمل المحفوظة
        Object.keys(this.progress.sentences).forEach(level => {
            stats.sentences[level] = Object.keys(this.progress.sentences[level]).length;
            stats.total += stats.sentences[level];
        });
        
        return stats;
    }

    getLastSavedItems(limit = 10) {
        const allItems = [];
        
        // جمع جميع العناصر المحفوظة
        Object.keys(this.progress.vocabulary).forEach(level => {
            Object.entries(this.progress.vocabulary[level]).forEach(([id, data]) => {
                allItems.push({
                    ...data,
                    id,
                    level,
                    type: 'vocabulary'
                });
            });
        });
        
        Object.keys(this.progress.sentences).forEach(level => {
            Object.entries(this.progress.sentences[level]).forEach(([id, data]) => {
                allItems.push({
                    ...data,
                    id,
                    level,
                    type: 'sentences'
                });
            });
        });
        
        // ترتيب حسب تاريخ الحفظ
        allItems.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        
        return allItems.slice(0, limit);
    }

    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `english-course-progress-${this.currentUser}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    resetProgress() {
        if (confirm('هل أنت متأكد من حذف جميع بيانات التقدم؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            this.progress = {
                vocabulary: { a1: {}, a2: {}, b1: {}, b2: {} },
                sentences: { a1: {}, a2: {}, b1: {}, b2: {} },
                lastActivity: null,
                totalSaved: 0
            };
            this.saveProgress();
            location.reload();
        }
    }
}

// تهيئة النظام
let progressSystem;

document.addEventListener('DOMContentLoaded', function() {
    // انتظار تحميل نظام المستخدمين إذا كان متاحاً
    setTimeout(() => {
        progressSystem = new ProgressSystem();
    }, 500);
});

// دوال عامة للوصول من صفحات أخرى
function getProgressSystem() {
    return progressSystem;
}

function getProgressStats() {
    return progressSystem ? progressSystem.getOverallStats() : null;
}

function getLastSavedItems(limit) {
    return progressSystem ? progressSystem.getLastSavedItems(limit) : [];
}

function exportUserProgress() {
    if (progressSystem) {
        progressSystem.exportProgress();
    }
}

function resetUserProgress() {
    if (progressSystem) {
        progressSystem.resetProgress();
    }
}

