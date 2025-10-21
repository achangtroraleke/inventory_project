#!/usr/bin/env bash
# Exit on error
set -o errexit

# =========================================================
# 1. INSTALL PYTHON/DJANGO DEPENDENCIES (Render usually handles this in the Build Command)
# =========================================================
echo "Installing Python dependencies..."
# Assuming requirements.txt is at the root of the backend directory
pip install -r requirements.txt

# =========================================================
# 2. BUILD REACT FRONTEND
# =========================================================
echo "Building React frontend..."

# Change into the frontend directory
cd frontend

# Install Node dependencies (needed for the build process)
npm install

# Run the production build (creates the 'build' or 'dist' folder)
npm run build

# Change back to the repository root directory
cd ..

# Convert static asset files
python manage.py collectstatic --no-input
python manage.py makemigrations

# Apply any outstanding database migrations
python manage.py migrate

