using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public class LogoPerfectorFinal2 {
    public static void Clean(string inputPath, string outputPath) {
        using (Bitmap src = new Bitmap(inputPath)) {
            int w = src.Width;
            int h = src.Height;
            
            // Raw logo bounding coordinates:
            // Diamond top tip ~ (512, 38)
            // Leftmost leaf edge ~ 380, rightmost leaf ~ 645
            // 'A' left edge ~ 260, 't' right edge ~ 764
            // Subtitle: x ~ 262 to 765, y ~ 410 to 435
            // Bar: x ~ 335 to 735, y ~ 445 to 465
            
            int cropX = 250;
            int cropY = 32;
            int cropW = 535;
            int cropH = 445;
            
            Bitmap dest = new Bitmap(cropW, cropH, PixelFormat.Format32bppArgb);
            
            BitmapData srcData = src.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
            BitmapData dstData = dest.LockBits(new Rectangle(0, 0, cropW, cropH), ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
            
            byte[] srcBytes = new byte[srcData.Stride * h];
            byte[] dstBytes = new byte[dstData.Stride * cropH];
            Marshal.Copy(srcData.Scan0, srcBytes, 0, srcBytes.Length);
            
            for (int dy = 0; dy < cropH; dy++) {
                int sy = dy + cropY;
                for (int dx = 0; dx < cropW; dx++) {
                    int sx = dx + cropX;
                    
                    int sIdx = sy * srcData.Stride + sx * 4;
                    int dIdx = dy * dstData.Stride + dx * 4;
                    
                    byte b = srcBytes[sIdx];
                    byte g = srcBytes[sIdx + 1];
                    byte r = srcBytes[sIdx + 2];
                    
                    int max = Math.Max(r, Math.Max(g, b));
                    int min = Math.Min(r, Math.Min(g, b));
                    int sat = max - min;
                    int bright = (r + g + b) / 3;
                    
                    double alpha = 0.0;
                    
                    // Region 1: Diamond (sx between 485 and 545, sy between 35 and 95)
                    if (sx >= 485 && sx <= 545 && sy >= 35 && sy <= 95) {
                        // Diamond polygon bounds:
                        // Top (512, 38), Bottom (512, 92), Left (488, 68), Right (538, 68)
                        // A point inside this diamond satisfies:
                        // |sx - 512| / 26.0 + |sy - 65| / 27.0 <= 1.05
                        double diamondMetric = Math.Abs(sx - 512.0) / 25.5 + Math.Abs(sy - 65.0) / 27.0;
                        if (diamondMetric <= 1.02) {
                            alpha = 1.0;
                        } else if (diamondMetric <= 1.08) {
                            alpha = (1.08 - diamondMetric) / 0.06;
                        }
                    }
                    // Region 2: Subtitle text "BOTANICAL LIVING & SMART CARE" (sy between 405 and 435)
                    else if (sy >= 405 && sy <= 435) {
                        if (sat >= 12 && (r > b + 10 || g > b + 10)) {
                            alpha = Math.Min(1.0, (sat - 9) / 7.0);
                        } else if (bright < 110 && sat > 7) {
                            alpha = Math.Min(1.0, (110 - bright) / 25.0);
                        }
                    }
                    // Region 3: Bottom horizontal bar (sy >= 440)
                    else if (sy >= 440) {
                        if (sx > 745) {
                            alpha = 0.0;
                        } else if (sx >= 720 && sx <= 745) {
                            // Gold dot
                            if (sat >= 16 && r > b + 15) alpha = 1.0;
                            else if (bright > 180 && r > b + 25) alpha = 1.0;
                        } else if (sx >= 330 && sx <= 720) {
                            // Bar
                            if (sat >= 15 && (g > r + 6 || r > b + 15)) {
                                alpha = 1.0;
                            } else if (bright < 100 && sat > 8) {
                                alpha = 1.0;
                            }
                        }
                    }
                    // Region 4: Top gap between leaves (sx between 505 and 535, sy between 95 and 130)
                    else if (sx >= 505 && sx <= 535 && sy >= 95 && sy <= 130) {
                        // Background only (it is light gray wall between the leaves)
                        alpha = 0.0;
                    }
                    // Region 5: Main icon & text (Leaves, golden ring, Agrismart)
                    else {
                        // Foreground has high saturation or dark text colors
                        if (sat >= 18) {
                            alpha = Math.Min(1.0, (sat - 14) / 7.0);
                        } else if (bright < 95) {
                            if (bright < 55) alpha = 1.0;
                            else if (sat > 7 && (b > r || r > b + 8 || g > r)) {
                                alpha = Math.Min(1.0, (95 - bright) / 25.0);
                            }
                        } else if (sat >= 13 && (r > 135 && g > 115 && b < 110)) { // Soft gold rim
                            alpha = Math.Min(1.0, (sat - 10) / 6.0);
                        }
                    }
                    
                    if (alpha > 0.05) {
                        int outA = (int)(alpha * 255);
                        if (outA > 255) outA = 255;
                        
                        dstBytes[dIdx] = b;
                        dstBytes[dIdx + 1] = g;
                        dstBytes[dIdx + 2] = r;
                        dstBytes[dIdx + 3] = (byte)outA;
                    } else {
                        dstBytes[dIdx] = 0;
                        dstBytes[dIdx + 1] = 0;
                        dstBytes[dIdx + 2] = 0;
                        dstBytes[dIdx + 3] = 0;
                    }
                }
            }
            
            Marshal.Copy(dstBytes, 0, dstData.Scan0, dstBytes.Length);
            src.UnlockBits(srcData);
            dest.UnlockBits(dstData);
            
            dest.Save(outputPath, ImageFormat.Png);
        }
    }
}
