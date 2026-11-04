Add-Type -AssemblyName System.Drawing

function Render-SimpleLogoPNG {
    param(
        [string]$outputPath,
        [int]$width = 1600,
        [int]$height = 450,
        [bool]$isMarkOnly = $false,
        [bool]$tightCrop = $true
    )

    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Brand Colors
    $cNavy = [System.Drawing.Color]::FromArgb(255, 2, 31, 67)      # #021F43
    $cBlue = [System.Drawing.Color]::FromArgb(255, 0, 98, 255)     # #0062FF
    $cCyan = [System.Drawing.Color]::FromArgb(255, 0, 180, 216)    # #00B4D8

    $bNavy = New-Object System.Drawing.SolidBrush($cNavy)
    $bBlue = New-Object System.Drawing.SolidBrush($cBlue)
    $penCyan = New-Object System.Drawing.Pen($cCyan)
    $penBlue = New-Object System.Drawing.Pen($cBlue)

    # Coordinate system: Base Mark is 100x100
    $scale = if ($isMarkOnly) { 3.8 } else { 3.4 }
    $offsetX = if ($isMarkOnly) { ($width - (90 * $scale)) / 2.0 } else { 30.0 }
    $offsetY = 30.0

    $T = {
        param($x, $y)
        return New-Object System.Drawing.PointF ($offsetX + ($x * $scale)), ($offsetY + ($y * $scale))
    }

    # 1. Circuit Traces & Terminal Rings
    $penTrace = New-Object System.Drawing.Pen($cCyan, (2.4 * $scale))
    $penTrace.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penTrace.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penTrace.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Left Trace
    $g.DrawLine($penTrace, (& $T 58 39), (& $T 55 24))
    
    # Center Trace (tallest)
    $g.DrawLine($penTrace, (& $T 64 44), (& $T 66 16))
    
    # Right Trace
    $g.DrawLine($penTrace, (& $T 70 50), (& $T 78 28))
    $penTrace.Dispose()

    # Terminal Rings (Hollow open loops with stroke)
    $penRing = New-Object System.Drawing.Pen($cCyan, (2.2 * $scale))
    $drawRing = {
        param($cx, $cy, $r)
        $pt = & $T $cx $cy
        $rad = $r * $scale
        $rect = New-Object System.Drawing.RectangleF ($pt.X - $rad), ($pt.Y - $rad), ($rad * 2), ($rad * 2)
        $g.DrawEllipse($penRing, $rect)
    }

    & $drawRing 55 21 3.0
    & $drawRing 66 13 3.4
    & $drawRing 78 25 3.0
    $penRing.Dispose()

    # 2. Roof Gable (Deep Navy)
    $pathRoof = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptsRoof = @(
        (& $T 16 54),
        (& $T 46 25),
        (& $T 76 54),
        (& $T 69.5 59.5),
        (& $T 46 36.5),
        (& $T 22.5 59.5)
    )
    $pathRoof.AddPolygon($ptsRoof)
    $g.FillPath($bNavy, $pathRoof)
    $pathRoof.Dispose()

    # 3. 4 Window Panes (2x2 Grid)
    $drawWin = {
        param($x, $y, $w, $h)
        $pt = & $T $x $y
        $rect = New-Object System.Drawing.RectangleF $pt.X, $pt.Y, ($w * $scale), ($h * $scale)
        $g.FillRectangle($bBlue, $rect)
    }
    & $drawWin 40.5 38.0 5.0 4.5
    & $drawWin 47.5 38.0 5.0 4.5
    & $drawWin 40.5 44.2 5.0 4.5
    & $drawWin 47.5 44.2 5.0 4.5

    # 4. Navy Arched Doorway & Left Foundation Block
    $pathDoor = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptD1 = & $T 38 84
    $ptD2 = & $T 38 73
    $pathDoor.AddLine($ptD1, $ptD2)

    $archPt = & $T 38 66
    $archW = 14.0 * $scale
    $archH = 14.0 * $scale
    $archRect = New-Object System.Drawing.RectangleF $archPt.X, $archPt.Y, $archW, $archH
    $pathDoor.AddArc($archRect, 180, 180)

    $ptD3 = & $T 52 73
    $ptD4 = & $T 52 84
    $pathDoor.AddLine($ptD3, $ptD4)
    $pathDoor.CloseFigure()
    $g.FillPath($bNavy, $pathDoor)
    $pathDoor.Dispose()

    # Left Foundation Block
    $ptBase = & $T 20 78
    $g.FillRectangle($bNavy, (New-Object System.Drawing.RectangleF $ptBase.X, $ptBase.Y, (14.0 * $scale), (6.0 * $scale)))

    # 5. Simple Flowing "S" Path (Uniform-width smooth rounded stroke)
    $penS = New-Object System.Drawing.Pen($cBlue, (6.8 * $scale))
    $penS.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penS.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penS.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $pathS = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pS1 = & $T 21 59
    $pS2 = & $T 66 59
    $pathS.AddLine($pS1, $pS2)

    # 180 degree smooth curve on right edge
    $pC1 = & $T 75.5 59
    $pC2 = & $T 75.5 73.5
    $pS3 = & $T 66 73.5
    $pathS.AddBezier($pS2, $pC1, $pC2, $pS3)

    $pS4 = & $T 24 73.5
    $pathS.AddLine($pS3, $pS4)

    $g.DrawPath($penS, $pathS)
    $penS.Dispose()
    $pathS.Dispose()

    # 6. Typography
    if (-not $isMarkOnly) {
        $textStartX = $offsetX + (95.0 * $scale)
        $textStartY = $offsetY + (22.0 * $scale)

        # "SmartStay"
        $fontTitle = New-Object System.Drawing.Font("Segoe UI", (54.0 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        
        $sizeSmart = $g.MeasureString("Smart", $fontTitle, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)
        $sizeStay = $g.MeasureString("Stay", $fontTitle, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)
        
        $g.DrawString("Smart", $fontTitle, $bNavy, (New-Object System.Drawing.PointF $textStartX, $textStartY), [System.Drawing.StringFormat]::GenericTypographic)
        $g.DrawString("Stay", $fontTitle, $bBlue, (New-Object System.Drawing.PointF ($textStartX + $sizeSmart.Width - (2.0 * $scale)), $textStartY), [System.Drawing.StringFormat]::GenericTypographic)

        $totalTitleWidth = $sizeSmart.Width + $sizeStay.Width - (2.0 * $scale)

        # Tagline: "— Campus Living —"
        $taglineY = $textStartY + (56.0 * $scale)
        $fontTag = New-Object System.Drawing.Font("Segoe UI", (17.5 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        
        $tagText = "Campus Living"
        $sizeTag = $g.MeasureString($tagText, $fontTag, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)

        $linePen = New-Object System.Drawing.Pen($bNavy, (2.6 * $scale))
        $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        
        $lineY = $taglineY + ($sizeTag.Height / 2.0)
        $lineLen = 28.0 * $scale
        $lineGap = 10.0 * $scale

        $totalTaglineBlock = $lineLen + $lineGap + $sizeTag.Width + $lineGap + $lineLen
        $taglineOffset = [Math]::Max(0.0, ($totalTitleWidth - $totalTaglineBlock) / 2.0)

        # Left line
        $g.DrawLine($linePen, ($textStartX + $taglineOffset), $lineY, ($textStartX + $taglineOffset + $lineLen), $lineY)
        
        # Text
        $tagTextX = $textStartX + $taglineOffset + $lineLen + $lineGap
        $g.DrawString($tagText, $fontTag, $bNavy, (New-Object System.Drawing.PointF $tagTextX, $taglineY), [System.Drawing.StringFormat]::GenericTypographic)
        
        # Right line
        $rightLineStartX = $tagTextX + $sizeTag.Width + $lineGap
        $g.DrawLine($linePen, $rightLineStartX, $lineY, ($rightLineStartX + $lineLen), $lineY)

        $linePen.Dispose()
        $fontTitle.Dispose()
        $fontTag.Dispose()
    }

    # Clean up brushes
    $bNavy.Dispose()
    $bBlue.Dispose()
    $g.Dispose()

    # Auto-crop to content with 18px padding
    if ($tightCrop) {
        $minX = 9999; $maxX = 0; $minY = 9999; $maxY = 0
        for ($x = 0; $x -lt $bmp.Width; $x += 2) {
            for ($y = 0; $y -lt $bmp.Height; $y += 2) {
                $p = $bmp.GetPixel($x, $y)
                if ($p.A -gt 15) {
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }

        if ($minX -lt $maxX -and $minY -lt $maxY) {
            $pad = 18
            $cropX = [Math]::Max(0, $minX - $pad)
            $cropY = [Math]::Max(0, $minY - $pad)
            $cropW = [Math]::Min($bmp.Width - $cropX, ($maxX - $minX) + ($pad * 2))
            $cropH = [Math]::Min($bmp.Height - $cropY, ($maxY - $minY) + ($pad * 2))

            $croppedBmp = New-Object System.Drawing.Bitmap $cropW, $cropH
            $cropG = [System.Drawing.Graphics]::FromImage($croppedBmp)
            $cropG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $cropG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
            $cropG.DrawImage($bmp, 0, 0, (New-Object System.Drawing.Rectangle $cropX, $cropY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
            $cropG.Dispose()

            $bmp.Dispose()
            $croppedBmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
            $croppedBmp.Dispose()
            Write-Host "Rendered tight crop: $outputPath ($cropW x $cropH)"
            return
        }
    }

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Rendered: $outputPath ($width x $height)"
}

# Deploy Simple High-Res Assets
$destFull = "frontend/src/assets/smartstay-logo.png"
$destMark = "frontend/src/assets/smartstay-mark.png"

Render-SimpleLogoPNG -outputPath $destFull -width 1600 -height 450 -isMarkOnly $false -tightCrop $true
Render-SimpleLogoPNG -outputPath $destMark -width 600 -height 600 -isMarkOnly $true -tightCrop $true

# Copy to aliases and public
$copies = @(
    @{ Src = $destFull; Dests = @("frontend/src/assets/logo.png", "frontend/public/smartstay-logo.png", "frontend/public/logo.png", "frontend/dist/smartstay-logo.png", "frontend/dist/logo.png") },
    @{ Src = $destMark; Dests = @("frontend/src/assets/logo-icon.png", "frontend/public/smartstay-mark.png", "frontend/public/logo-icon.png", "frontend/public/favicon.png", "frontend/dist/smartstay-mark.png", "frontend/dist/logo-icon.png", "frontend/dist/favicon.png") }
)

foreach ($c in $copies) {
    foreach ($d in $c.Dests) {
        Copy-Item -Path $c.Src -Destination $d -Force
        Write-Host "Copied $($c.Src) -> $d"
    }
}
