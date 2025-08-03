# Automated Content Management

This system automatically generates the JSON files for photos and 3D renders by scanning the file system and reading info files.

## 📁 Directory Structure

### Photos
```
public/images/photos/
├── album1/
│   ├── info.txt         # Album metadata
│   ├── 1.jpg           # Album photos
│   ├── 2.jpg
│   └── 3.jpg
├── album2/
│   ├── info.txt
│   ├── 1.jpg
│   └── 2.jpg
└── single/             # Individual photos
    ├── single1/
    │   ├── info.txt    # Photo metadata
    │   └── 1.jpg       # Photo image
    ├── single2/
    │   ├── info.txt
    │   └── 1.jpg
    └── single3/
        ├── info.txt
        └── 1.jpg
```

### 3D Renders
```
public/images/3d/
├── neon-cube/
│   ├── info.txt        # Render metadata
│   └── 1.jpg          # Render image(s)
├── synthwave-landscape/
│   ├── info.txt
│   └── 1.jpg
└── digital-decay/
    ├── info.txt
    └── 1.jpg
```

## 📝 Info File Format

Create an `info.txt` file in each album/render directory:

```
title: Your Album/Render Title
description: A description of the content
date: 2025-08-03
tags: tag1, tag2, tag3
```

### Example for Photo Albums:
```
title: Urban Explorations
description: Capturing the essence of city life through my lens
date: 2025-08-01
tags: photography, urban, street, nefas
```

### Example for Single Photos:
```
title: Captured Moment #1
description: A glimpse through my lens
date: 2025-07-25
tags: photography, original, nefas
```

### Example Directory Structure for New Single Photo:
```
public/images/photos/single/single5/
├── info.txt          # Photo metadata
└── photo.jpg         # Your photo
```

### Example for 3D:
```
title: Neon Cube Matrix
description: Floating geometric forms in digital space
date: 2025-08-01
tags: 3d, render, neon, geometric
```

## 🚀 Usage

### Adding New Content

1. **For Photo Albums:**
   - Create a new folder in `public/images/photos/`
   - Add your images (jpg, jpeg, png, gif, webp)
   - Create an `info.txt` file with album details
   - Run the generation script

2. **For Single Photos:**
   - Create a new folder in `public/images/photos/single/` (e.g., `single5/`)
   - Add your photo image
   - Create an `info.txt` file with photo details
   - Run the generation script

3. **For 3D Renders:**
   - Create a new folder in `public/images/3d/`
   - Add your render image(s)
   - Create an `info.txt` file with render details
   - Run the generation script

### Generating JSON Files

Run the content generator:

```bash
# Using npm script
npm run generate

# Or directly
node generate-content.cjs
```

This will:
- Scan all photo and 3D directories
- Parse info.txt files
- Generate updated `photos.json` and `3d.json` files
- Sort content by date (newest first)

## 🔄 Workflow

1. **Add new content** to the appropriate directories
2. **Create info.txt** files with metadata
3. **Run generator** script
4. **Commit and push** to GitHub (if using Git deployment)
5. **Content appears** automatically on the website

## 📋 Notes

- The script overwrites existing JSON files completely
- Images are sorted alphabetically within albums
- Date format should be YYYY-MM-DD
- Tags are comma-separated
- The first image in an album becomes the cover image
- Single photos get auto-generated titles like "Captured Moment #1"

## 🛠️ Automation Ideas

You could further automate this by:
- Adding a GitHub Action that runs the script on push
- Creating a watch script that regenerates on file changes
- Building a simple web interface for content management
- Adding image optimization during generation
