import re

pages = [
    'a1-sentences.html',
    'a2-sentences.html',
    'b1-sentences.html',
    'b2-sentences.html',
    'c1-sentences.html',
    'c2-sentences.html'
]

speak_function = '''
<!-- Audio System -->
<script>
let currentAudio = null;

function speakText(text, index) {
    console.log('🔊 Playing audio:', index);
    
    // Stop previous audio
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    // Get level from page
    const level = document.body.dataset.level || 'a1';
    
    // Create audio path
    const audioPath = `audio/${level}/sentence_${index}.mp3`;
    console.log('🎵 Audio URL:', audioPath);
    
    // Create and play audio
    currentAudio = new Audio(audioPath);
    
    currentAudio.onerror = function(e) {
        console.error('❌ Audio error:', e);
        alert('حدث خطأ في تحميل الملف الصوتي');
    };
    
    currentAudio.play().catch(error => {
        console.error('❌ Error playing audio:', error);
        alert('حدث خطأ في تشغيل الصوت. يرجى المحاولة مرة أخرى.');
    });
}
</script>
'''

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # إضافة دالة speakText قبل </body>
    if 'function speakText' not in content:
        content = content.replace('</body>', speak_function + '\n</body>')
        print(f"✅ تم إضافة دالة speakText إلى {page}")
    else:
        print(f"⚠️ دالة speakText موجودة مسبقاً في {page}")
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)

print("\n✅ تم إضافة دالة speakText لجميع الصفحات!")
