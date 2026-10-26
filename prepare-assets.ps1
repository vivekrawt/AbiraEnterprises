$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = Split-Path $PSScriptRoot -Parent
$files = Get-ChildItem -LiteralPath @((Join-Path $root 'Confetti'),(Join-Path $root 'Corporate Stationery'),(Join-Path $root 'Corrugated Boxes'),(Join-Path $root 'Custom Cards Envelopes'),(Join-Path $root 'Gifting Boxes'),(Join-Path $root 'Safety Wraps')) -Recurse -File | Where-Object { $_.Extension -in '.jpeg','.jpg' } | Sort-Object FullName | ForEach-Object { $_.FullName }
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
  $bitmap.Save((Join-Path $PSScriptRoot "client\public\assets\product-$i.jpg"),$encoder,$parameters)
  $relative = $files[$i].Substring($root.Length+1)
  $records += [PSCustomObject]@{ id=$i; src="assets/product-$i.jpg"; category=($relative -split '\\')[0]; source=$relative }
  $graphics.Dispose(); $bitmap.Dispose(); $source.Dispose()
}
$records | ConvertTo-Json | Set-Content (Join-Path $PSScriptRoot 'server\data\catalogue.json') -Encoding utf8
Write-Output "Prepared $($records.Count) catalogue images."
