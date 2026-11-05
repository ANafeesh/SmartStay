Add-Type -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class LogoExtract {
    public static Bitmap Extract(Bitmap src, int x, int y, int w, int h, int pad) {
        int outW = w + pad * 2;
        int outH = h + pad * 2;
        Bitmap dest = new Bitmap(outW, outH);

        BitmapData srcData = src.LockBits(new Rectangle(x, y, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        BitmapData destData = dest.LockBits(new Rectangle(pad, pad, w, h), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);

        int bytes = srcData.Stride * h;
        byte[] srcBuffer = new byte[bytes];
        byte[] destBuffer = new byte[destData.Stride * h];

        Marshal.Copy(srcData.Scan0, srcBuffer, 0, bytes);

        for (int row = 0; row < h; row++) {
            int srcRowOffset = row * srcData.Stride;
            int destRowOffset = row * destData.Stride;

            for (int col = 0; col < w; col++) {
                int si = srcRowOffset + col * 4;
                int di = destRowOffset + col * 4;

                byte b = srcBuffer[si];
                byte g = srcBuffer[si + 1];
                byte r = srcBuffer[si + 2];

                int minVal = Math.Min(r, Math.Min(g, b));

                if (minVal >= 247) {
                    destBuffer[di] = 0;
                    destBuffer[di + 1] = 0;
                    destBuffer[di + 2] = 0;
                    destBuffer[di + 3] = 0;
                } else if (minVal >= 225) {
                    float factor = (247f - minVal) / 22f;
                    byte a = (byte)Math.Max(0, Math.Min(255, (int)(255 * factor)));
                    destBuffer[di] = b;
                    destBuffer[di + 1] = g;
                    destBuffer[di + 2] = r;
                    destBuffer[di + 3] = a;
                } else {
                    destBuffer[di] = b;
                    destBuffer[di + 1] = g;
                    destBuffer[di + 2] = r;
                    destBuffer[di + 3] = 255;
                }
            }
        }

        Marshal.Copy(destBuffer, 0, destData.Scan0, destBuffer.Length);
        src.UnlockBits(srcData);
        dest.UnlockBits(destData);
        return dest;
    }
}
"@ -ReferencedAssemblies System.Drawing

$srcPath = "C:\Users\USER\.gemini\antigravity\brain\1ef8f450-c03f-4681-b577-6b67dbbca03c\.user_uploaded\media_1793839997152_0336b51f.jpg"
$origBmp = [System.Drawing.Bitmap]::FromFile($srcPath)

# Convert source to 32bppArgb first
$src = New-Object System.Drawing.Bitmap $origBmp.Width, $origBmp.Height
$g0 = [System.Drawing.Graphics]::FromImage($src)
$g0.DrawImage($origBmp, 0, 0, $origBmp.Width, $origBmp.Height)
$g0.Dispose()
$origBmp.Dispose()

Write-Host "Extracting Mark..."
$markBmp = [LogoExtract]::Extract($src, 185, 145, 712, 478, 12)

Write-Host "Extracting Text..."
$textBmp = [LogoExtract]::Extract($src, 125, 635, 780, 195, 10)

Write-Host "Extracting Stacked..."
$stackedBmp = [LogoExtract]::Extract($src, 125, 145, 780, 685, 16)

# Compose Horizontal Layout
Write-Host "Composing Horizontal Layout..."
$targetH = 400
$scaleMark = 360.0 / $markBmp.Height
$markW = [int]($markBmp.Width * $scaleMark)
$markH = 360

$scaleText = 180.0 / $textBmp.Height
$textW = [int]($textBmp.Width * $scaleText)
$textH = 180

$gap = 35
$totalW = $markW + $gap + $textW + 40
$horizBmp = New-Object System.Drawing.Bitmap $totalW, $targetH
$g = [System.Drawing.Graphics]::FromImage($horizBmp)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

$markY = [int](($targetH - $markH) / 2.0)
$g.DrawImage($markBmp, 20, $markY, $markW, $markH)

$textY = [int](($targetH - $textH) / 2.0)
$g.DrawImage($textBmp, (20 + $markW + $gap), $textY, $textW, $textH)
$g.Dispose()

# Deploy
$destFull = "frontend/src/assets/smartstay-logo.png"
$destMark = "frontend/src/assets/smartstay-mark.png"
$destStacked = "frontend/src/assets/smartstay-logo-stacked.png"

$horizBmp.Save($destFull, [System.Drawing.Imaging.ImageFormat]::Png)
$markBmp.Save($destMark, [System.Drawing.Imaging.ImageFormat]::Png)
$stackedBmp.Save($destStacked, [System.Drawing.Imaging.ImageFormat]::Png)

# Favicon: 128x128
$favBmp = New-Object System.Drawing.Bitmap 128, 128
$favG = [System.Drawing.Graphics]::FromImage($favBmp)
$favG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$favG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$favG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$favG.Clear([System.Drawing.Color]::Transparent)
$favScale = 112.0 / [Math]::Max($markBmp.Width, $markBmp.Height)
$favW = [int]($markBmp.Width * $favScale)
$favH = [int]($markBmp.Height * $favScale)
$favX = [int]((128 - $favW) / 2.0)
$favY = [int]((128 - $favH) / 2.0)
$favG.DrawImage($markBmp, $favX, $favY, $favW, $favH)
$favG.Dispose()
$favBmp.Save("frontend/public/favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favBmp.Save("frontend/dist/favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$favBmp.Dispose()

# Copy to aliases and dist
Copy-Item -Path $destFull -Destination "frontend/src/assets/logo.png" -Force
Copy-Item -Path $destFull -Destination "frontend/public/smartstay-logo.png" -Force
Copy-Item -Path $destFull -Destination "frontend/public/logo.png" -Force
Copy-Item -Path $destFull -Destination "frontend/dist/smartstay-logo.png" -Force
Copy-Item -Path $destFull -Destination "frontend/dist/logo.png" -Force

Copy-Item -Path $destMark -Destination "frontend/src/assets/logo-icon.png" -Force
Copy-Item -Path $destMark -Destination "frontend/public/smartstay-mark.png" -Force
Copy-Item -Path $destMark -Destination "frontend/public/logo-icon.png" -Force
Copy-Item -Path $destMark -Destination "frontend/dist/smartstay-mark.png" -Force
Copy-Item -Path $destMark -Destination "frontend/dist/logo-icon.png" -Force

Copy-Item -Path $destStacked -Destination "frontend/public/smartstay-logo-stacked.png" -Force
Copy-Item -Path $destStacked -Destination "frontend/dist/smartstay-logo-stacked.png" -Force

Write-Host "SUCCESS: Horizontal=$($horizBmp.Width)x$($horizBmp.Height), Mark=$($markBmp.Width)x$($markBmp.Height), Stacked=$($stackedBmp.Width)x$($stackedBmp.Height)"

$src.Dispose()
$markBmp.Dispose()
$textBmp.Dispose()
$stackedBmp.Dispose()
$horizBmp.Dispose()
