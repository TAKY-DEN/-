// ملف JavaScript لإضافة صوت تكة لجميع الأزرار
(function() {
    // إنشاء عنصر الصوت
    const clickSound = new Audio('audio/ui/click.mp3');
    clickSound.volume = 0.3;
    
    // دالة لتشغيل الصوت
    function playClickSound(e) {
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            // تجاهل الأخطاء
        });
    }
    
    // دالة لفحص إذا كان العنصر زر صوت
    function isAudioButton(element) {
        const text = element.textContent || '';
        const onclick = element.onclick ? element.onclick.toString() : '';
        const className = element.className || '';
        
        return element.classList.contains('audio-button') || 
               onclick.includes('playAudio') ||
               onclick.includes('playLetterName') ||
               onclick.includes('playLetterSound') ||
               onclick.includes('speakText') ||
               text.includes('🔊') ||
               text.includes('🎵') ||
               text.includes('استمع') ||
               text.includes('اسم الحرف') ||
               text.includes('صوت الحرف');
    }
    
    // دالة لإضافة الصوت لعنصر
    function addClickSound(element) {
        if (!isAudioButton(element)) {
            element.addEventListener('click', playClickSound);
        }
    }
    
    // إضافة الصوت عند تحميل الصفحة
    document.addEventListener('DOMContentLoaded', function() {
        // جميع الأزرار والروابط
        const elements = document.querySelectorAll('button, a, .card, .level-card, .back-button, .nav-button');
        elements.forEach(addClickSound);
        
        // مراقبة الأزرار الجديدة (للمحتوى الديناميكي)
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1) { // Element node
                        if (node.matches && node.matches('button, a, .card, .level-card')) {
                            addClickSound(node);
                        }
                        // البحث عن أزرار داخل العنصر المضاف
                        if (node.querySelectorAll) {
                            const innerElements = node.querySelectorAll('button, a, .card, .level-card');
                            innerElements.forEach(addClickSound);
                        }
                    }
                });
            });
        });
        
        // بدء المراقبة
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
})();

