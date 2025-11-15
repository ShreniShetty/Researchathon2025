#!/bin/bash
cd /Users/shrenishetty/Downloads/MentalHealthBuddy

# Initialize git repository
git init

# Add remote repository
git remote add origin https://github.com/ShreniShetty/Researchathon2025.git

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Mental Health Buddy project"

# Push to repository
git branch -M main
git push -u origin main

echo "Repository setup complete!"

