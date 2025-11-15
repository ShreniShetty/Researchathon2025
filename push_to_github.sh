#!/bin/bash
# Script to push Mental Health Buddy to GitHub
# Run this after accepting the Xcode license: sudo xcodebuild -license

cd /Users/shrenishetty/Downloads/MentalHealthBuddy

echo "Initializing git repository..."
git init

echo "Adding remote repository..."
git remote add origin https://github.com/ShreniShetty/Researchathon2025.git 2>/dev/null || git remote set-url origin https://github.com/ShreniShetty/Researchathon2025.git

echo "Adding all files..."
git add .

echo "Creating initial commit..."
git commit -m "Initial commit: Mental Health Buddy project"

echo "Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Repository setup complete!"
echo "Your code has been pushed to: https://github.com/ShreniShetty/Researchathon2025"

