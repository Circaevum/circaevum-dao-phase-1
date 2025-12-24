# Screenshot Organizer Script

## Overview

The `organize-screenshots.py` script automatically identifies Circaevum-related screenshots from `~/Pictures/Screenshots`, copies them to the repository, and attempts to match them to versions/problems.

## Features

1. **Automatic Detection**: Identifies Circaevum screenshots by filename keywords and recent timestamps
2. **Version Detection**: Attempts to extract version numbers using:
   - OCR (Optical Character Recognition) to read version labels from images
   - Git commit timestamp matching
   - Changelog parsing
3. **Platform Classification**: Classifies screenshots as Unity/Web/Backend based on filename and content
4. **Organization**: Copies screenshots to appropriate directories:
   - Web screenshots → `yang/web/screenshots/`
   - Unity screenshots → `yang/unity/contributions/screenshots/`
   - Unknown → `docs/screenshots/`
5. **Tracking**: Creates/updates `screenshot-registry.csv` with metadata

## Installation

### Required Packages

```bash
# Install Python dependencies
pip install Pillow pytesseract

# Install Tesseract OCR (macOS)
brew install tesseract

# On Linux:
# sudo apt-get install tesseract-ocr
```

### Optional but Recommended

The script works without OCR, but version detection will be limited to git commit matching.

## Usage

```bash
# From repository root
cd zhong/tracking
python3 organize-screenshots.py

# Or make executable and run directly
chmod +x organize-screenshots.py
./organize-screenshots.py
```

## How It Works

### 1. Screenshot Identification

The script identifies Circaevum screenshots by:
- Filename keywords: "circaevum", "circa", "timebox", "calendarium", "zhong", "yin", "yang", etc.
- Recent timestamps: Screenshots from last 90 days (heuristic)

### 2. Version Detection

Multiple methods are tried in order:

1. **OCR (if available)**: Extracts text from image, looks for version patterns (v0.4.03, etc.)
2. **Git Commit Matching**: Compares screenshot timestamp to nearby git commits
3. **Changelog Parsing**: Extracts versions from changelog files

### 3. Platform Classification

Classifies based on:
- Filename keywords (unity, web, avp, quest, etc.)
- OCR text content (if available)
- Defaults to "Unknown" if unclear

### 4. File Organization

Screenshots are copied with timestamp prefixes to avoid conflicts:
- Format: `YYYYMMDD-HHMMSS-originalname.png`
- Stored in platform-specific directories

## Screenshot Registry CSV

The script creates/updates `screenshot-registry.csv` with columns:

- `timestamp`: When screenshot was taken (file modification time)
- `original_path`: Original location in ~/Pictures/Screenshots
- `repo_path`: New location in repository (relative path)
- `platform`: Unity/Web/Backend/Unknown
- `version`: Detected version number (or "unknown")
- `version_source`: How version was detected (OCR/Git/none)
- `problem_id`: PROBLEM-YIN/YANG-XXX (manual entry recommended)
- `link_status`: "linked" if version found, "unknown" otherwise
- `file_size`: File size in bytes
- `image_dimensions`: Width x Height (if available)
- `notes`: Free-form notes field

## Manual Review and Updates

After running the script:

1. **Review the CSV**: Check `zhong/tracking/screenshot-registry.csv`
2. **Update Versions**: Manually correct version numbers if needed
3. **Link to Problems**: Add `problem_id` values (PROBLEM-YIN-001, etc.)
4. **Add Notes**: Document what the screenshot shows
5. **Verify Platform**: Correct platform classification if wrong

## Example Workflow

```bash
# 1. Take screenshots during development
# (screenshots saved to ~/Pictures/Screenshots/)

# 2. Run organizer
python3 organize-screenshots.py

# 3. Review results
cat zhong/tracking/screenshot-registry.csv

# 4. Edit CSV to add problem IDs and notes
# (Use spreadsheet app or text editor)

# 5. Re-run to process new screenshots
# (Script skips already-processed files)
```

## Limitations

- **OCR Accuracy**: OCR may not always detect version numbers, especially in complex 3D scenes
- **Timestamp Matching**: Git commit matching has ±1 day window
- **Platform Detection**: May misclassify if filename/content unclear
- **Version Parsing**: Only recognizes standard version formats (v0.4.03, etc.)

## Tips for Better Results

1. **Clear Filenames**: Name screenshots with relevant keywords (e.g., "circaevum-web-v0.4.03.png")
2. **Visible Version Labels**: Include version numbers in UI when taking screenshots
3. **Regular Processing**: Run script frequently to keep registry up-to-date
4. **Manual Review**: Always review and correct the CSV after running

## Troubleshooting

**Script can't find screenshots**:
- Verify `~/Pictures/Screenshots` exists
- Check file permissions

**OCR not working**:
- Ensure tesseract is installed: `brew install tesseract`
- Verify pytesseract can find tesseract: `which tesseract`

**Version not detected**:
- Check if version is visible in screenshot
- Verify git commits exist around screenshot time
- Manually add version to CSV

**Platform misclassified**:
- Update filename with platform keyword
- Manually correct in CSV

---

**Last Updated**: December 23, 2025

