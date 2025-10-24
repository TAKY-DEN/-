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
    
    # إضافة data-level إلى body
    content = re.sub(r'<body>', f'<body data-level="{level}">', content)
    
    with open(page, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ تم إضافة data-level=\"{level}\" إلى {page}")

print("\n✅ تم إضافة data-level لجميع الصفحات!")
