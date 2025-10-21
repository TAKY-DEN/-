#!/bin/bash

# List of HTML files to update
files=(
    "a1-vocabulary.html" "a1-sentences.html"
    "a2-vocabulary.html" "a2-sentences.html"
    "b1-vocabulary.html" "b1-sentences.html"
    "b2-vocabulary.html" "b2-sentences.html"
    "c1-vocabulary.html" "c1-sentences.html"
    "c2-vocabulary.html" "c2-sentences.html"
    "progress-tracker.html"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        # Check if Firebase is already added
        if ! grep -q "firebase-app-compat" "$file"; then
            # Find the line with script.js and add Firebase scripts before it
            sed -i '/<script src="script.js"><\/script>/i\    <!-- Firebase SDKs -->\n    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>\n    <script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>\n    \n    <!-- Firebase Configuration -->\n    <script src="firebase-config.js"></script>\n    <script src="firebase-auth.js"></script>\n' "$file"
            echo "✓ Added Firebase to $file"
        else
            echo "- Firebase already in $file"
        fi
    fi
done
