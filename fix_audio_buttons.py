import re

pages = [
    ('a1-sentences.html', 'a1'),
    ('a2-sentences.html', 'a2'),
    ('b1-sentences.html', 'b1'),
    ('b2-sentences.html', 'b2'),
    ('c1-sentences.html', 'c1'),
    ('c2-sentences.html', 'c2')
]

for page, level in pages:
    with open(page, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # العثور على جميع البطاقات وتحديث أزرار الاستماع
    cards = re.findall(r'<div class="sentence-card" data-index="(\d+)">(.*?)</div>\s*</div>', content, re.DOTALL)
    
    for index, card_content in cards:
        # البحث عن زر الاستماع القديم
        old_button = re.search(r'<button class="audio-btn" onclick="speakText\([^)]+\)">🔊 استماع</button>', card_content)
        if old_button:
            # استبداله بزر جديد يمرر index
            new_button = f'<button class="audio-btn" onclick="speakText(\'\', {index})">🔊 استماع</button>'
            content = content.replace(old_button.group(0), new_button)
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ تم تحديث أزرار الاستماع في {page}")

print("\n✅ تم تحديث جميع أزرار الاستماع!")
