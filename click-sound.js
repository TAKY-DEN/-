// ملف JavaScript لإضافة صوت نقر خفيف لجميع الأزرار
(function() {
    // إنشاء عنصر الصوت
    const clickSound = new Audio('audio/ui/click.mp3');
    clickSound.volume = 0.3; // صوت خفيف
    
    // دالة لتشغيل الصوت
    function playClickSound() {
        clickSound.currentTime = 0; // إعادة تشغيل من البداية
        clickSound.play().catch(err => {
            // تجاهل الأخطاء (مثل عدم السماح بالتشغيل التلقائي)
            console.log('Click sound blocked:', err);
        });
    }
    
    // إضافة الصوت لجميع الأزرار والروابط عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // اختيار جميع الأزرار والروابط
        const clickableElements = document.querySelectorAll('button, a, .card, .level-card');
        
        clickableElements.forEach(element => {
            // استثناء أزرار الصوت
            const isAudioButton = element.classList.contains('audio-button') || 
                                 element.onclick && element.onclick.toString().includes('playAudio') ||
                                 element.onclick && element.onclick.toString().includes('playLetterName') ||
                                 element.onclick && element.onclick.toString().includes('playLetterSound') ||
                                 element.textContent.includes('🔊') ||
                                 element.textContent.includes('🎵') ||
                                 element.textContent.includes('استمع') ||
                                 element.textContent.includes('اسم الحرف') ||
                                 element.textContent.includes('صوت الحرف');
            
            if (!isAudioButton) {
                element.addEventListener('click', playClickSound);
            }
        });
    });
})();
