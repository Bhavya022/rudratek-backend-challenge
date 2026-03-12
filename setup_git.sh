#!/bin/bash

# Initialize git
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: Rudratek Backend Challenge implementation"

echo "Git repository initialized and initial commit made."
echo "You can now create a new repository on GitHub and follow the instructions to push your code:"
echo "git remote add origin YOUR_GITHUB_REPO_URL"
echo "git branch -M main"
echo "git push -u origin main"
