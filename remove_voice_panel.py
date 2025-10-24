import re

pages = [
    'a1-sentences.html',
    'a2-sentences.html',
    'b1-sentences.html',
    'b2-sentences.html',
    'c1-sentences.html',
    'c2-sentences.html'
]

for page in pages:
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # حذف CSS الخاص بـ voice-settings
    content = re.sub(
        r'/\* Voice Settings Panel \*/.*?@media \(max-width: 768px\) \{.*?\}.*?\}',
        '',
        content,
        flags=re.DOTALL
    )
    
    # حذف HTML الخاص بـ voice-settings
    content = re.sub(
        r'<!-- Voice Gender Selection -->.*?</div>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # تحديث مسار الصوت في JavaScript
    level = page.split('-')[0]
    content = re.sub(
        r"const audioPath = `audio/" + level + r"/\$\{selectedVoice\}/sentence_\$\{index\}\.mp3`;",
        f"const audioPath = `audio/{level}/sentence_${{index}}.mp3`;",
        content
    )
    
    # حذف selectedVoice variable
    content = re.sub(r'let selectedVoice = [^;]+;', '', content)
    
    # حذف event listener للـ voice-gender
    content = re.sub(
        r"document\.getElementById\('voice-gender'\)\.addEventListener\('change'.*?\}\);",
        '',
        content,
        flags=re.DOTALL
    )
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ تم تحديث {page}")

print("\n✅ تم حذف جميع قوائم اختيار الصوت!")
