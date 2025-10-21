import re

# Read the HTML file
with open('/home/ubuntu/english-course-website/c2-sentences.html', 'r') as f:
    content = f.read()

# Find all save buttons and their sentences
matches = re.findall(r'<td><button class="save-btn" onclick="saveSentence\(this, \'(.*?)\", \'c2-sentences\'\)">⭕ حفظ<\/button><\/td>', content)

# Replace the onclick attributes
for i, sentence in enumerate(matches):
    old_onclick = f"onclick=\"saveSentence(this, '{sentence}', 'c2-sentences')\""
    new_onclick = f"onclick=\"window.progressSystem.toggleSave('sentences', 'c2', {i}, '{sentence}')\""
    content = content.replace(old_onclick, new_onclick)

# Write the updated content back to the file
with open('/home/ubuntu/english-course-website/c2-sentences.html', 'w') as f:
    f.write(content)

print("c2-sentences.html has been updated.")
