Add-Type -AssemblyName System.Drawing

function Render-ThemeLogoPNG {
    param(
        [string]$outputPath,
        [int]$width = 1400,
        [int]$height = 360,
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

    # SmartStay Main Theme Colors:
    # Slate 900 (#0F172A)
    $cPrimary = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)
    # Smart Blue (#2563EB)
    $cBlue = [System.Drawing.Color]::FromArgb(255, 37, 99, 235)
    # Accent Cyan (#0EA5E9)
    $cCyan = [System.Drawing.Color]::FromArgb(255, 14, 165, 233)
    # Secondary Slate 500 (#64748B)
    $cSecondary = [System.Drawing.Color]::FromArgb(255, 100, 116, 139)
    # Divider Line (#CBD5E1)
    $cLine = [System.Drawing.Color]::FromArgb(255, 203, 213, 225)

    $bPrimary = New-Object System.Drawing.SolidBrush($cPrimary)
    $bBlue = New-Object System.Drawing.SolidBrush($cBlue)
    $bCyan = New-Object System.Drawing.SolidBrush($cCyan)
    $bSecondary = New-Object System.Drawing.SolidBrush($cSecondary)

    # Scale and placement
    $scale = if ($isMarkOnly) { 7.5 } else { 6.8 }
    $offsetX = if ($isMarkOnly) { ($width - (44.0 * $scale)) / 2.0 } else { 35.0 }
    $offsetY = 30.0

    $T = {
        param($x, $y)
        return New-Object System.Drawing.PointF ($offsetX + ($x * $scale)), ($offsetY + ($y * $scale))
    }

    # 1. Circuit Traces & Nodes (Cyan #0EA5E9)
    $penTrace = New-Object System.Drawing.Pen($cCyan, (1.8 * $scale))
    $penTrace.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penTrace.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $g.DrawLine($penTrace, (& $T 26 18), (& $T 26 9))
    $g.DrawLine($penTrace, (& $T 30 21), (& $T 32 5))
    $g.DrawLine($penTrace, (& $T 34 24), (& $T 37 11))
    $penTrace.Dispose()

    # Terminal Node circles
    $drawNode = {
        param($cx, $cy, $r)
        $pt = & $T $cx $cy
        $rad = $r * $scale
        $rect = New-Object System.Drawing.RectangleF ($pt.X - $rad), ($pt.Y - $rad), ($rad * 2), ($rad * 2)
        $g.FillEllipse($bCyan, $rect)
    }
    & $drawNode 26 7 2.0
    & $drawNode 32 4 2.2
    & $drawNode 37 9 2.0

    # 2. Roof Gable (Slate 900 #0F172A)
    $pathRoof = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptsRoof = @(
        (& $T 6 24),
        (& $T 22 10),
        (& $T 38 24),
        (& $T 35 26.8),
        (& $T 22 15.2),
        (& $T 9 26.8)
    )
    $pathRoof.AddPolygon($ptsRoof)
    $g.FillPath($bPrimary, $pathRoof)
    $pathRoof.Dispose()

    # 3. 4 Window Panes (Smart Blue #2563EB)
    $drawWin = {
        param($x, $y, $w, $h)
        $pt = & $T $x $y
        $rect = New-Object System.Drawing.RectangleF $pt.X, $pt.Y, ($w * $scale), ($h * $scale)
        $g.FillRectangle($bBlue, $rect)
    }
    & $drawWin 19.4 16.2 2.2 2.0
    & $drawWin 22.4 16.2 2.2 2.0
    & $drawWin 19.4 19.0 2.2 2.0
    & $drawWin 22.4 19.0 2.2 2.0

    # 4. Doorway & Left Foundation (Slate 900 #0F172A)
    $pathDoor = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptD1 = & $T 18 38
    $ptD2 = & $T 18 32
    $pathDoor.AddLine($ptD1, $ptD2)

    $archPt = & $T 18 28
    $archW = 8.0 * $scale
    $archH = 8.0 * $scale
    $archRect = New-Object System.Drawing.RectangleF $archPt.X, $archPt.Y, $archW, $archH
    $pathDoor.AddArc($archRect, 180, 180)

    $ptD3 = & $T 26 32
    $ptD4 = & $T 26 38
    $pathDoor.AddLine($ptD3, $ptD4)
    $pathDoor.CloseFigure()
    $g.FillPath($bPrimary, $pathDoor)
    $pathDoor.Dispose()

    # Foundation block
    $ptBase = & $T 9 35
    $g.FillRectangle($bPrimary, (New-Object System.Drawing.RectangleF $ptBase.X, $ptBase.Y, (7.0 * $scale), (3.0 * $scale)))

    # 5. Simple Flowing "S" Path (Smart Blue #2563EB)
    $penS = New-Object System.Drawing.Pen($cBlue, (3.2 * $scale))
    $penS.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penS.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penS.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    $pathS = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pS1 = & $T 9.5 26.8
    $pS2 = & $T 30.5 26.8
    $pathS.AddLine($pS1, $pS2)

    # 180 degree curve around right edge
    $pC1 = & $T 35.5 26.8
    $pC2 = & $T 35.5 33.5
    $pS3 = & $T 30.5 33.5
    $pathS.AddBezier($pS2, $pC1, $pC2, $pS3)

    $pS4 = & $T 11.0 33.5
    $pathS.AddLine($pS3, $pS4)

    $g.DrawPath($penS, $pathS)
    $penS.Dispose()
    $pathS.Dispose()

    # 6. Typography
    if (-not $isMarkOnly) {
        $textStartX = $offsetX + (48.0 * $scale)
        $textStartY = $offsetY + (9.0 * $scale)

        # "SmartStay"
        $fontTitle = New-Object System.Drawing.Font("Segoe UI", (26.0 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        
        $sizeSmart = $g.MeasureString("Smart", $fontTitle, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)
        $sizeStay = $g.MeasureString("Stay", $fontTitle, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)
        
        $g.DrawString("Smart", $fontTitle, $bPrimary, (New-Object System.Drawing.PointF $textStartX, $textStartY), [System.Drawing.StringFormat]::GenericTypographic)
        $g.DrawString("Stay", $fontTitle, $bBlue, (New-Object System.Drawing.PointF ($textStartX + $sizeSmart.Width - (1.0 * $scale)), $textStartY), [System.Drawing.StringFormat]::GenericTypographic)

        $totalTitleWidth = $sizeSmart.Width + $sizeStay.Width - (1.0 * $scale)

        # Tagline: "— CAMPUS LIVING —"
        $taglineY = $textStartY + (27.0 * $scale)
        $fontTag = New-Object System.Drawing.Font("Segoe UI", (9.5 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
        
        $tagText = "CAMPUS LIVING"
        $sizeTag = $g.MeasureString($tagText, $fontTag, [System.Drawing.PointF]::Empty, [System.Drawing.StringFormat]::GenericTypographic)

        $linePen = New-Object System.Drawing.Pen($cLine, (1.8 * $scale))
        $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
        $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
        
        $lineY = $taglineY + ($sizeTag.Height / 2.0)
        $lineLen = 14.0 * $scale
        $lineGap = 6.0 * $scale

        # Left line
        $g.DrawLine($linePen, $textStartX, $lineY, ($textStartX + $lineLen), $lineY)
        
        # Text
        $tagTextX = $textStartX + $lineLen + $lineGap
        $g.DrawString($tagText, $fontTag, $bSecondary, (New-Object System.Drawing.PointF $tagTextX, $taglineY), [System.Drawing.StringFormat]::GenericTypographic)
        
        # Right line
        $rightLineStartX = $tagTextX + $sizeTag.Width + $lineGap
        $g.DrawLine($linePen, $rightLineStartX, $lineY, ($rightLineStartX + $lineLen), $lineY)

        $linePen.Dispose()
        $fontTitle.Dispose()
        $fontTag.Dispose()
    }

    # Clean up brushes
    $bPrimary.Dispose()
    $bBlue.Dispose()
    $bCyan.Dispose()
    $bSecondary.Dispose()
    $g.Dispose()

    # Auto-crop to content with 14px padding
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
            $pad = 14
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

# Deploy Theme High-Res Assets
$destFull = "frontend/src/assets/smartstay-logo.png"
$destMark = "frontend/src/assets/smartstay-mark.png"

Render-ThemeLogoPNG -outputPath $destFull -width 1400 -height 360 -isMarkOnly $false -tightCrop $true
Render-ThemeLogoPNG -outputPath $destMark -width 512 -height 512 -isMarkOnly $true -tightCrop $true

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
