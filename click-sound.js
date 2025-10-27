// ملف JavaScript لإضافة صوت تكة لجميع الأزرار
(function() {
    // إنشاء عنصر الصوت
    const clickSound = new Audio('audio/ui/click.mp3');
    clickSound.volume = 0.3;
    
    // دالة لتشغيل الصوت
    function playClickSound() {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            console.log('Click sound blocked:', err);
        });
    }
    
    // إضافة الصوت لجميع الأزرار والروابط عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // اختيار جميع الأزرار والروابط
        const clickableElements = document.querySelectorAll('button, a, .card, .level-card');
        
        clickableElements.forEach(element => {
            // استثناء أزرار الصوت فقط
            const text = element.textContent || '';
            const onclick = element.onclick ? element.onclick.toString() : '';
            
            const isAudioButton = element.classList.contains('audio-button') || 
                                 onclick.includes('playAudio') ||
                                 onclick.includes('playLetterName') ||
                                 onclick.includes('playLetterSound') ||
                                 text.includes('🔊') ||
                                 text.includes('🎵') ||
                                 text.includes('استمع') ||
                                 text.includes('اسم الحرف') ||
                                 text.includes('صوت الحرف');
            
            if (!isAudioButton) {
                element.addEventListener('click', playClickSound);
            }
        });
    });
})();

