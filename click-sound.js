// ملف JavaScript لإضافة أصوات تفاعلية
(function() {
    // إنشاء عناصر الصوت
    const saveSound = new Audio('audio/ui/click.mp3'); // صوت الحفظ
    saveSound.volume = 0.3;
    
    const pageFlipSound = new Audio('audio/ui/page-flip.mp3'); // صوت تقليب الورق
    pageFlipSound.volume = 0.25;
    
    // دالة لتشغيل صوت الحفظ
    function playSaveSound() {
        saveSound.currentTime = 0;
        saveSound.play().catch(err => {
            console.log('Save sound blocked:', err);
        });
    }
    
    // دالة لتشغيل صوت تقليب الورق
    function playPageFlipSound() {
        pageFlipSound.currentTime = 0;
        pageFlipSound.play().catch(err => {
            console.log('Page flip sound blocked:', err);
        });
    }
    
    // إضافة الأصوات عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // اختيار جميع العناصر القابلة للنقر
        const allElements = document.querySelectorAll('button, a, .card, .level-card');
        
        allElements.forEach(element => {
            // تحديد نوع العنصر
            const text = element.textContent || '';
            const onclick = element.onclick ? element.onclick.toString() : '';
            
            // استثناء أزرار الصوت (بدون صوت)
            const isAudioButton = element.classList.contains('audio-button') || 
                                 onclick.includes('playAudio') ||
                                 onclick.includes('playLetterName') ||
                                 onclick.includes('playLetterSound') ||
                                 text.includes('🔊') ||
                                 text.includes('🎵') ||
                                 text.includes('استمع') ||
                                 text.includes('اسم الحرف') ||
                                 text.includes('صوت الحرف');
            
            if (isAudioButton) {
                return; // لا صوت لأزرار الصوت
            }
            
            // أزرار الحفظ - صوت النقر
            const isSaveButton = text.includes('حفظ') || 
                                text.includes('Save') ||
                                onclick.includes('toggleSave');
            
            if (isSaveButton) {
                element.addEventListener('click', playSaveSound);
                return;
            }
            
            // باقي الأزرار - صوت تقليب الورق
            element.addEventListener('click', playPageFlipSound);
        });
    });
})();
