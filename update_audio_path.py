import re

# قائمة الصفحات
pages = [
    'a1-sentences-new.html',
    'a2-sentences-new.html',
    'b1-sentences-new.html',
    'b2-sentences-new.html',
    'c1-sentences-new.html',
    'c2-sentences-new.html'
]

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # إزالة قائمة اختيار الصوت
    content = re.sub(r'<div class="voice-panel">.*?</div>', '', content, flags=re.DOTALL)
    
    # تحديث مسار الصوت من male/female إلى المجلد الرئيسي
    level = page.split('-')[0]
    content = re.sub(
        r"const audioPath = `audio/" + level + r"/\$\{selectedVoice\}/sentence_\$\{index\}\.mp3`;",
        f"const audioPath = `audio/{level}/sentence_${{index}}.mp3`;",
        content
    )
    
    # إزالة متغير selectedVoice
    content = re.sub(r'let selectedVoice = .*;', '', content)
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ تم تحديث {page}")

print("\n✅ تم تحديث جميع الصفحات!")
