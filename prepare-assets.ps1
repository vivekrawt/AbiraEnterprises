$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$files = Get-Content (Join-Path $PSScriptRoot 'review\images.txt')
$records = @()
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$parameters = New-Object System.Drawing.Imaging.EncoderParameters(1)
$parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]86)
for ($i=0; $i -lt $files.Count; $i++) {
  $source = [System.Drawing.Image]::FromFile($files[$i])
  $scale = [Math]::Min(1.0, 1200.0/[Math]::Max($source.Width,$source.Height))
  $bitmap = New-Object System.Drawing.Bitmap([int]($source.Width*$scale),[int]($source.Height*$scale))
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($source,0,0,$bitmap.Width,$bitmap.Height)
  $bitmap.Save((Join-Path $PSScriptRoot "dist\assets\product-$i.jpg"),$encoder,$parameters)
  $relative = $files[$i].Substring($root.Length+1)
  $records += [PSCustomObject]@{ id=$i; src="assets/product-$i.jpg"; category=($relative -split '\\')[0]; source=$relative }
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}
$records | ConvertTo-Json | Set-Content (Join-Path $PSScriptRoot 'dist\catalogue.json') -Encoding utf8
Write-Output "Prepared $($records.Count) catalogue images."
