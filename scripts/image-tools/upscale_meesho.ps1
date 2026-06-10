$srcDir  = 'C:\Users\shubh\.gemini\antigravity\brain\c6056f37-5225-4957-82f4-fdb7277720e6'
$destDir = 'C:\Users\shubh\grocerywebsite\grocerywebsite\Meesho_Images'

New-Item -ItemType Directory -Force -Path $destDir | Out-Null
Write-Host "Destination folder ready: $destDir"

$items = @(
    @{ src = 'meesho_turmeric_low_shipping_1772516936902.png';  dest = 'Turmeric_Meesho_Main.png'        },
    @{ src = 'meesho_turmeric_lifestyle_1772517240632.png';     dest = 'Turmeric_Meesho_Lifestyle.png'   },
    @{ src = 'meesho_turmeric_infographic_1772517252720.png';   dest = 'Turmeric_Meesho_Infographic.png' },
    @{ src = 'meesho_turmeric_fssai_cert_1772517275549.png';    dest = 'Turmeric_Meesho_FSSAI.png'       },
    @{ src = 'meesho_chai_masala_main_1772522043843.png';       dest = 'ChaiMasala_Meesho_Main.png'      },
    @{ src = 'meesho_garam_masala_main_1772522068938.png';      dest = 'GaramMasala_Meesho_Main.png'     },
    @{ src = 'meesho_chai_garam_combo_premium_1772522089436.png'; dest = 'ChaiGaram_Combo_Meesho.png'    }
)

Add-Type -AssemblyName System.Drawing

foreach ($item in $items) {
    $srcPath  = Join-Path $srcDir  $item.src
    $destPath = Join-Path $destDir $item.dest

    if (-not (Test-Path $srcPath)) {
        Write-Host "MISSING: $($item.src)"
        continue
    }

    try {
        $src = [System.Drawing.Image]::FromFile($srcPath)
        $origW = $src.Width
        $origH = $src.Height

        $newW = 2000
        $newH = 2000

        $bmp = New-Object System.Drawing.Bitmap($newW, $newH)
        $g   = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($src, 0, 0, $newW, $newH)

        $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $g.Dispose()
        $bmp.Dispose()
        $src.Dispose()

        $sizeMB = [math]::Round((Get-Item $destPath).Length / 1MB, 2)
        Write-Host "OK: $($item.dest)  [${origW}x${origH} -> ${newW}x${newH}  ${sizeMB} MB]"
    }
    catch {
        Write-Host "ERROR on $($item.src): $($_.Exception.Message)"
        Copy-Item $srcPath $destPath -Force
        $sizeMB = [math]::Round((Get-Item $destPath).Length / 1MB, 2)
        Write-Host "Fallback copy: $($item.dest)  [${sizeMB} MB]"
    }
}

Write-Host ""
$files = Get-ChildItem $destDir -Filter *.png
Write-Host "Total files in Meesho_Images: $($files.Count)"
foreach ($f in $files) {
    $sizeMB = [math]::Round($f.Length / 1MB, 2)
    Write-Host "  $($f.Name)  $sizeMB MB"
}
