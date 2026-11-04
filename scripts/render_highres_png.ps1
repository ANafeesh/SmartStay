Add-Type -AssemblyName System.Drawing

function Render-LogoPNG {
    param(
        [string]$outputPath,
        [int]$width = 1600,
        [int]$height = 420,
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

    # Color definitions matching brand specification
    $cNavy = [System.Drawing.Color]::FromArgb(255, 2, 31, 67)      # #021F43
    $cBlue = [System.Drawing.Color]::FromArgb(255, 0, 100, 242)    # #0064F2
    $cCyan = [System.Drawing.Color]::FromArgb(255, 0, 163, 224)    # #00A3E0
    $cWhite = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)

    $bNavy = New-Object System.Drawing.SolidBrush($cNavy)
    $bBlue = New-Object System.Drawing.SolidBrush($cBlue)
    $bCyan = New-Object System.Drawing.SolidBrush($cCyan)
    $bWhite = New-Object System.Drawing.SolidBrush($cWhite)

    # Coordinate system: Base Mark is 100x100
    $scale = if ($isMarkOnly) { 3.6 } else { 3.4 }
    $offsetX = if ($isMarkOnly) { ($width - (90 * $scale)) / 2.0 } else { 30.0 }
    $offsetY = 35.0

    $T = {
        param($x, $y)
        return New-Object System.Drawing.PointF ($offsetX + ($x * $scale)), ($offsetY + ($y * $scale))
    }

    # 1. Circuit Traces (Smart Connectivity)
    $penCyan = New-Object System.Drawing.Pen($cCyan, (2.6 * $scale))
    $penCyan.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penCyan.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $penCyan.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Left Trace
    $pts1 = @(
        (& $T 52 33),
        (& $T 52 23),
        (& $T 48 16)
    )
    $g.DrawLines($penCyan, $pts1)

    # Middle Trace (highest)
    $pts2 = @(
        (& $T 59 38),
        (& $T 59 23),
        (& $T 63 9)
    )
    $g.DrawLines($penCyan, $pts2)

    # Right Trace
    $pts3 = @(
        (& $T 66 44),
        (& $T 70 34),
        (& $T 76 21)
    )
    $g.DrawLines($penCyan, $pts3)
    $penCyan.Dispose()

    # 2. Circuit Nodes (Cyan circle with white center)
    $drawNode = {
        param($cx, $cy, $r)
        $pt = & $T $cx $cy
        $rad = $r * $scale
        $rect = New-Object System.Drawing.RectangleF ($pt.X - $rad), ($pt.Y - $rad), ($rad * 2), ($rad * 2)
        $g.FillEllipse($bCyan, $rect)
        $innerRad = $rad * 0.38
        $innerRect = New-Object System.Drawing.RectangleF ($pt.X - $innerRad), ($pt.Y - $innerRad), ($innerRad * 2), ($innerRad * 2)
        $g.FillEllipse($bWhite, $innerRect)
    }

    & $drawNode 48 16 3.2
    & $drawNode 63 9 3.6
    & $drawNode 76 21 3.2

    # 3. Peaked Roof Gable (Deep Navy)
    $pathRoof = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptsRoof = @(
        (& $T 7 49),
        (& $T 38 18),
        (& $T 69 49),
        (& $T 62.5 54.5),
        (& $T 38 29.5),
        (& $T 13.5 54.5)
    )
    $pathRoof.AddPolygon($ptsRoof)
    $g.FillPath($bNavy, $pathRoof)
    $pathRoof.Dispose()

    # 4. 4 Window Panes (2x2 Grid in Vibrant Electric Blue)
    $drawWin = {
        param($x, $y, $w, $h)
        $pt = & $T $x $y
        $rect = New-Object System.Drawing.RectangleF $pt.X, $pt.Y, ($w * $scale), ($h * $scale)
        $g.FillRectangle($bBlue, $rect)
    }
    & $drawWin 32.5 35.0 5.0 4.5
    & $drawWin 39.0 35.0 5.0 4.5
    & $drawWin 32.5 41.0 5.0 4.5
    & $drawWin 39.0 41.0 5.0 4.5

    # 5. Flowing "S" Ribbon (Electric Blue)
    $pathS = New-Object System.Drawing.Drawing2D.GraphicsPath
    
    # Outer profile of the "S"
    $pS0 = & $T 14.5 51.0
    $pS1 = & $T 10.5 57.0
    $pS2 = & $T 11.0 65.5
    $pS3 = & $T 19.5 68.0   # Left curve outward
    $pathS.AddBezier($pS0, $pS1, $pS2, $pS3)

    $pS4 = & $T 27.0 70.0
    $pS5 = & $T 38.0 66.0
    $pS6 = & $T 54.0 66.0   # Across middle
    $pathS.AddBezier($pS3, $pS4, $pS5, $pS6)

    $pS7 = & $T 67.0 66.0
    $pS8 = & $T 74.5 70.0
    $pS9 = & $T 74.5 76.0   # Right loop
    $pathS.AddBezier($pS6, $pS7, $pS8, $pS9)

    $pS10 = & $T 74.5 82.0
    $pS11 = & $T 68.0 86.0
    $pS12 = & $T 58.0 86.0  # Swoop bottom
    $pathS.AddBezier($pS9, $pS10, $pS11, $pS12)

    $pS13 = & $T 43.0 86.0
    $pS14 = & $T 31.0 83.5
    $pS15 = & $T 21.0 80.5  # Bottom left taper
    $pathS.AddBezier($pS12, $pS13, $pS14, $pS15)

    $pS16 = & $T 17.5 79.5
    $pS17 = & $T 15.0 82.0
    $pS18 = & $T 15.0 84.5  # Bottom left turn
    $pathS.AddBezier($pS15, $pS16, $pS17, $pS18)

    $pS19 = & $T 15.0 87.5
    $pS20 = & $T 17.5 89.5
    $pS21 = & $T 22.0 91.0  # Return sweep
    $pathS.AddBezier($pS18, $pS19, $pS20, $pS21)

    $pS22 = & $T 33.0 94.0
    $pS23 = & $T 47.0 95.0
    $pS24 = & $T 60.0 94.0
    $pathS.AddBezier($pS21, $pS22, $pS23, $pS24)

    $pS25 = & $T 73.0 93.0
    $pS26 = & $T 82.5 86.5
    $pS27 = & $T 82.5 75.0  # Outer right envelope
    $pathS.AddBezier($pS24, $pS25, $pS26, $pS27)

    $pS28 = & $T 82.5 63.5
    $pS29 = & $T 71.0 58.5
    $pS30 = & $T 56.0 58.5  # Across top envelope
    $pathS.AddBezier($pS27, $pS28, $pS29, $pS30)

    $pS31 = & $T 40.0 58.5
    $pS32 = & $T 28.0 61.5
    $pS33 = & $T 22.0 59.5
    $pathS.AddBezier($pS30, $pS31, $pS32, $pS33)

    $pS34 = & $T 18.0 58.5
    $pS35 = & $T 17.0 55.5
    $pS36 = & $T 19.0 52.0
    $pathS.AddBezier($pS33, $pS34, $pS35, $pS36)

    $pathS.CloseFigure()
    $g.FillPath($bBlue, $pathS)
    $pathS.Dispose()

    # 6. House Base with Arched Entryway (Deep Navy)
    $pathBase = New-Object System.Drawing.Drawing2D.GraphicsPath
    $ptB1 = & $T 15.0 88.0
    $ptB2 = & $T 15.0 98.0
    $ptB3 = & $T 30.5 98.0
    $ptB4 = & $T 30.5 85.0   # Door left pillar
    
    $pathBase.AddLine($ptB1, $ptB2)
    $pathBase.AddLine($ptB2, $ptB3)
    $pathBase.AddLine($ptB3, $ptB4)
    
    # Door Arch (Round top arch from x=30.5 to x=46.5)
    $doorPt = & $T 30.5 77.0
    $doorW = 16.0 * $scale
    $doorH = 16.0 * $scale
    $doorRect = New-Object System.Drawing.RectangleF $doorPt.X, $doorPt.Y, $doorW, $doorH
    $pathBase.AddArc($doorRect, 180, 180)
    
    $ptB5 = & $T 46.5 85.0
    $ptB6 = & $T 46.5 98.0
    $ptB7 = & $T 66.5 98.0
    $ptB8 = & $T 66.5 93.0
    $pathBase.AddLine($ptB5, $ptB6)
    $pathBase.AddLine($ptB6, $ptB7)
    $pathBase.AddLine($ptB7, $ptB8)

    # Top contour of base following the S-ribbon gap
    $ptB9 = & $T 56.0 96.0
    $ptB10 = & $T 40.0 96.5
    $ptB11 = & $T 25.0 93.5
    $pathBase.AddCurve(@($ptB8, $ptB9, $ptB10, $ptB11, $ptB1))

    $pathBase.CloseFigure()
    $g.FillPath($bNavy, $pathBase)
    $pathBase.Dispose()

    # If full logo, render typography
    if (-not $isMarkOnly) {
        $textStartX = $offsetX + (95.0 * $scale)
        $textStartY = $offsetY + (24.0 * $scale)

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

        $linePen = New-Object System.Drawing.Pen($bNavy, (2.8 * $scale))
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
    $bCyan.Dispose()
    $bWhite.Dispose()
    $g.Dispose()

    # Auto-crop to content with 20px padding
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

# Render High-Res Assets
Render-LogoPNG -outputPath "test_highres_logo.png" -width 1600 -height 450 -isMarkOnly $false -tightCrop $true
Render-LogoPNG -outputPath "test_highres_mark.png" -width 600 -height 600 -isMarkOnly $true -tightCrop $true
