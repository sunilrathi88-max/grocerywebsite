$src = 'C:\Users\shubh\.gemini\antigravity\brain\c6056f37-5225-4957-82f4-fdb7277720e6'
$dst = 'C:\Users\shubh\grocerywebsite\grocerywebsite\Meesho_Images'

if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Force -Path $dst | Out-Null }

$map = [ordered]@{
    'meesho_turmeric_slot1_main_1772523182200.png'     = 'Turmeric_Slot1_Main.png'
    'meesho_turmeric_slot2_features_1772523283837.png' = 'Turmeric_Slot2_Features.png'
    'meesho_chai_slot1_main_1772523202370.png'         = 'ChaiMasala_Slot1_Main.png'
    'meesho_chai_slot2_features_1772523306711.png'     = 'ChaiMasala_Slot2_Features.png'
    'meesho_garam_slot1_main_1772523231364.png'        = 'GaramMasala_Slot1_Main.png'
    'meesho_garam_slot2_features_1772523330917.png'    = 'GaramMasala_Slot2_Features.png'
}

foreach ($k in $map.Keys) {
    $srcFile = Join-Path $src $k
    $dstFile = Join-Path $dst $map[$k]
    if (Test-Path $srcFile) {
        Copy-Item $srcFile $dstFile -Force
        "Copied: $($map[$k])" | Tee-Object -Append 'C:\Users\shubh\grocerywebsite\grocerywebsite\meesho_copy_log.txt'
    }
    else {
        "MISSING: $k" | Tee-Object -Append 'C:\Users\shubh\grocerywebsite\grocerywebsite\meesho_copy_log.txt'
    }
}

$files = Get-ChildItem $dst -Filter '*.png'
"Total: $($files.Count) files in Meesho_Images" | Tee-Object -Append 'C:\Users\shubh\grocerywebsite\grocerywebsite\meesho_copy_log.txt'
$files | ForEach-Object { "  $($_.Name)  $([math]::Round($_.Length/1MB,1)) MB" | Tee-Object -Append 'C:\Users\shubh\grocerywebsite\grocerywebsite\meesho_copy_log.txt' }
