---
name: video-edit
description: 'AI-powered video editing skill using FFmpeg. Use for ANY request involving video cutting, trimming, merging, transcoding, adding overlays, subtitles, effects, audio mixing, GIF conversion, and all /video commands. Handles single clips, batch processing, social-media exports, and multi-track compositing.'
argument-hint: '[cut|trim|merge|transcode|overlay|subtitle|gif|audio|batch] <input> [options]'
metadata:
  version: '1.0.0'
  author: Antigravity
  requires: 'ffmpeg (>=4.4)'
---

# Video Edit Skill — AI Video Editor powered by FFmpeg

## MANDATORY — Read before every operation

Before writing ANY FFmpeg command or calling ANY tool, you MUST:

1. Verify FFmpeg is installed (see § Pre-flight Check).
2. Understand the user's **intent** — do not guess format, codec, or quality.
3. Select the correct **workflow** from § Workflow Library.
4. Dry-run with `-v quiet -f null -` when probing or testing.

This is not optional. Do not skip even for "simple" requests.

---

## Quick Reference

| Command                          | What it does                        |
| -------------------------------- | ----------------------------------- |
| `/video cut <in> <start> <end>`  | Extract a clip between timestamps   |
| `/video trim <in> <duration>`    | Keep first N seconds                |
| `/video merge <file1> <file2> …` | Concatenate clips in order          |
| `/video transcode <in> <format>` | Re-encode to mp4/webm/mov/etc       |
| `/video overlay <in> <img>`      | Burn a logo/watermark onto video    |
| `/video subtitle <in> <srt>`     | Hardcode or softcode subtitles      |
| `/video gif <in>`                | Convert clip to optimised GIF       |
| `/video audio <in> <audio>`      | Replace or mix audio track          |
| `/video info <in>`               | Print stream metadata               |
| `/video batch <folder> <op>`     | Apply operation to all files        |
| `/video thumbnail <in> <time>`   | Extract a still frame               |
| `/video social <in> <platform>`  | Export for Instagram/TikTok/YouTube |

---

## Pre-flight Check

**Always run this first** to confirm FFmpeg is available:

```powershell
# Windows (PowerShell)
Get-Command ffmpeg -ErrorAction SilentlyContinue
ffmpeg -version | Select-String "ffmpeg version"

# If missing:
winget install Gyan.FFmpeg          # Windows
# or download from https://ffmpeg.org/download.html
```

```bash
# macOS / Linux
which ffmpeg && ffmpeg -version | head -1
# If missing:
brew install ffmpeg                 # macOS
sudo apt install ffmpeg             # Ubuntu/Debian
```

If FFmpeg is not installed, **stop and inform the user with the install command above**. Do not proceed.

---

## Step 1: Probe the Source File

Before any edit, understand what you're working with:

```bash
ffprobe -v quiet -print_format json -show_streams -show_format "$INPUT"
```

Key fields to extract:

- `streams[].codec_type` — video / audio / subtitle
- `streams[].codec_name` — h264, aac, vp9, etc.
- `format.duration` — total length in seconds
- `streams[video].width` × `height` — resolution
- `streams[video].r_frame_rate` — frame rate (e.g. 30000/1001 ≈ 29.97)
- `streams[audio].sample_rate` / `channel_layout`

---

## Workflow Library

### ✂️ CUT / TRIM

```bash
# Extract segment [start → end] — stream copy (lossless when re-encoding not needed)
ffmpeg -ss $START -to $END -i "$INPUT" -c copy "$OUTPUT"

# Trim first N seconds
ffmpeg -i "$INPUT" -t $DURATION -c copy "$OUTPUT"

# Frame-accurate cut (re-encode — slower but exact)
ffmpeg -ss $START -to $END -i "$INPUT" \
  -vf "setpts=PTS-STARTPTS" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  "$OUTPUT"
```

> **Rule:** Use `-c copy` for speed when codec compatibility allows. Re-encode only when the user needs frame accuracy or a different codec.

---

### 🔗 MERGE / CONCATENATE

Two methods depending on source compatibility:

**Method A — concat demuxer (same codec, fast):**

```bash
# 1. Create filelist.txt
echo "file 'clip1.mp4'" > filelist.txt
echo "file 'clip2.mp4'" >> filelist.txt

# 2. Concatenate
ffmpeg -f concat -safe 0 -i filelist.txt -c copy "$OUTPUT"
```

**Method B — filter_complex (different codecs/resolutions):**

```bash
ffmpeg \
  -i clip1.mp4 -i clip2.mp4 \
  -filter_complex \
    "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[vout][aout]" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  "$OUTPUT"
```

---

### 🔄 TRANSCODE

| Target           | Command snippet                                         |
| ---------------- | ------------------------------------------------------- |
| MP4 (H.264/AAC)  | `-c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k`  |
| MP4 (H.265/HEVC) | `-c:v libx265 -preset fast -crf 22 -c:a aac -b:a 192k`  |
| WebM (VP9)       | `-c:v libvpx-vp9 -b:v 0 -crf 30 -c:a libopus -b:a 128k` |
| MOV (ProRes)     | `-c:v prores_ks -profile:v 3 -c:a pcm_s16le`            |
| GIF              | See § GIF section                                       |

```bash
# Generic transcode to MP4
ffmpeg -i "$INPUT" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "$OUTPUT.mp4"
```

`-movflags +faststart` moves the moov atom to the file start (faster web playback).

---

### 🖼️ OVERLAY / WATERMARK

```bash
# Burn a logo (PNG with transparency) at bottom-right, 10px margin
ffmpeg -i "$VIDEO" -i "$LOGO" \
  -filter_complex \
    "[1:v]scale=W*0.15:-1[logo]; \
     [0:v][logo]overlay=W-w-10:H-h-10" \
  -c:a copy \
  "$OUTPUT"

# Repeating tiled watermark (diagonal)
ffmpeg -i "$VIDEO" -i "$WATERMARK" \
  -filter_complex \
    "[1:v]format=rgba,colorchannelmixer=aa=0.3[wm]; \
     [0:v][wm]overlay=x='mod(n*2,W)':y='mod(n,H)'" \
  "$OUTPUT"
```

---

### 📝 SUBTITLES

**Hardcoded (burned in — cannot be toggled off):**

```bash
ffmpeg -i "$VIDEO" \
  -vf "subtitles='$SRT_FILE':force_style='FontName=Arial,FontSize=24,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2'" \
  -c:a copy \
  "$OUTPUT"
```

**Softcoded (selectable track — MKV only):**

```bash
ffmpeg -i "$VIDEO" -i "$SRT_FILE" \
  -c:v copy -c:a copy -c:s mov_text \
  -metadata:s:s:0 language=eng \
  "$OUTPUT.mkv"
```

---

### 🎞️ GIF CONVERSION

High-quality GIF requires a two-pass palette approach:

```bash
# Pass 1: Generate optimal palette
ffmpeg -i "$INPUT" \
  -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" \
  palette.png

# Pass 2: Render GIF with palette
ffmpeg -i "$INPUT" -i palette.png \
  -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" \
  "$OUTPUT.gif"
```

> Lower `fps` (12–15) and `scale` (320–480px wide) keep file sizes reasonable. Always run both passes.

---

### 🔊 AUDIO OPERATIONS

```bash
# Replace audio entirely
ffmpeg -i "$VIDEO" -i "$AUDIO" \
  -map 0:v -map 1:a \
  -shortest -c:v copy \
  "$OUTPUT"

# Mix original audio with background music (-4dB music volume)
ffmpeg -i "$VIDEO" -i "$MUSIC" \
  -filter_complex \
    "[0:a]volume=1.0[orig]; \
     [1:a]volume=0.2[bg]; \
     [orig][bg]amix=inputs=2:duration=first[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy \
  "$OUTPUT"

# Remove audio (mute video)
ffmpeg -i "$INPUT" -an -c:v copy "$OUTPUT"

# Normalize audio loudness (EBU R128)
ffmpeg -i "$INPUT" \
  -af loudnorm=I=-16:TP=-1.5:LRA=11 \
  "$OUTPUT"
```

---

### 📸 THUMBNAIL EXTRACTION

```bash
# Extract frame at specific timestamp
ffmpeg -ss $TIMESTAMP -i "$INPUT" -frames:v 1 "$OUTPUT.jpg"

# Extract best frame (scene change detection)
ffmpeg -i "$INPUT" \
  -vf "select=gt(scene\,0.4),scale=1280:720" \
  -frames:v 1 "$OUTPUT.jpg"
```

---

### 📱 SOCIAL MEDIA EXPORTS

| Platform       | Resolution | Aspect | Max Duration | Settings      |
| -------------- | ---------- | ------ | ------------ | ------------- |
| Instagram Feed | 1080×1080  | 1:1    | 60s          | H.264, CRF 18 |
| Instagram Reel | 1080×1920  | 9:16   | 90s          | H.264, CRF 18 |
| TikTok         | 1080×1920  | 9:16   | 10min        | H.264, CRF 18 |
| YouTube        | 1920×1080  | 16:9   | unlimited    | H.264, CRF 16 |
| Twitter/X      | 1280×720   | 16:9   | 2min 20s     | H.264 ≤15MB   |
| LinkedIn       | 1920×1080  | 16:9   | 10min        | H.264, CRF 18 |

```bash
# Instagram Reel (9:16, 1080×1920, max 90s)
ffmpeg -i "$INPUT" \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,fps=30" \
  -c:v libx264 -preset fast -crf 18 \
  -c:a aac -b:a 192k \
  -t 90 \
  "$OUTPUT_reel.mp4"

# YouTube (16:9, 1920×1080)
ffmpeg -i "$INPUT" \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black,fps=30" \
  -c:v libx264 -preset slow -crf 16 \
  -c:a aac -b:a 320k \
  -movflags +faststart \
  "$OUTPUT_yt.mp4"
```

---

### 🗂️ BATCH PROCESSING

```powershell
# Windows PowerShell — convert all MKV to MP4 in a folder
Get-ChildItem -Path "$FOLDER" -Filter "*.mkv" | ForEach-Object {
    $out = $_.FullName -replace '\.mkv$', '.mp4'
    ffmpeg -i $_.FullName -c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k $out
}
```

```bash
# macOS/Linux — batch compress all mp4 in folder
for f in "$FOLDER"/*.mp4; do
    out="${f%.mp4}_compressed.mp4"
    ffmpeg -i "$f" -c:v libx264 -preset fast -crf 23 -c:a copy "$out"
done
```

---

## Quality Presets

| Preset Name | CRF | Preset Flag | Use Case             |
| ----------- | --- | ----------- | -------------------- |
| `draft`     | 28  | ultrafast   | Quick review         |
| `web`       | 23  | fast        | Streaming, social    |
| `standard`  | 18  | medium      | General delivery     |
| `archival`  | 12  | slow        | Master copy          |
| `lossless`  | 0   | veryslow    | Post-production only |

> **CRF guide:** lower = better quality + larger file. CRF 18 is visually lossless for most content.

---

## Common Filters Reference

```bash
# Resize (maintain aspect ratio)
-vf "scale=1280:-2"

# Crop to 16:9 from centre
-vf "crop=in_w:in_w*9/16"

# Rotate 90° clockwise
-vf "transpose=1"

# Flip horizontally
-vf "hflip"

# Speed up 2×
-vf "setpts=0.5*PTS" -af "atempo=2.0"

# Slow down 0.5×
-vf "setpts=2.0*PTS" -af "atempo=0.5"

# Fade in (first 1 second)
-vf "fade=in:0:30"

# Fade out (last 1 second of a 10s clip @ 30fps)
-vf "fade=out:270:30"

# Sharpen
-vf "unsharp=5:5:1.0:5:5:0.0"

# Denoise
-vf "hqdn3d=4:3:6:4"

# Add text overlay (timestamp)
-vf "drawtext=text='%{pts\:hms}':fontsize=36:fontcolor=white:x=10:y=10:shadowcolor=black:shadowx=2:shadowy=2"
```

---

## Error Handling

| Error                                      | Resolution                                            |
| ------------------------------------------ | ----------------------------------------------------- |
| `ffmpeg: command not found`                | Install FFmpeg — see § Pre-flight Check               |
| `Invalid data found when processing input` | File corrupted; try `-err_detect ignore_err`          |
| `Conversion failed!`                       | Wrong codec for container; check § Transcode table    |
| `No such file or directory`                | Escape spaces in paths: `"path with spaces/file.mp4"` |
| `moov atom not found`                      | MP4 downloaded incompletely; re-download              |
| Audio/video out of sync                    | Add `-async 1` or re-encode audio `-c:a aac`          |
| Output larger than input                   | Use lower CRF or add `-b:v TARGET_BITRATE`            |
| GIF huge file size                         | Reduce fps (12), scale (320px), or switch to WebP     |
| `height not divisible by 2`                | Use `scale=WIDTH:-2` instead of `scale=WIDTH:-1`      |

---

## Response Format

After every operation, always provide:

1. **The exact FFmpeg command used** — copy-paste ready
2. **Output file path** — where the result was saved
3. **Before/After info** — file size, resolution, duration
4. **Suggestions** — 1-2 refinement ideas (quality, format, next step)

---

## Safety Rules

- **Never overwrite the original.** Always write to a new output file.
- **Always quote paths** with spaces: `"my video/file.mp4"`.
- **Confirm before batch operations** that change many files.
- **Warn the user** if re-encoding will take >30 seconds for large files.
- Use `-progress pipe:1` to stream progress for long operations.
