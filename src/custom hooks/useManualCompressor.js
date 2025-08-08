// hooks/useImageCompressor.js
import { useCallback } from "react";

const useImageCompressor = () => {
  const compressImage = useCallback(
    (imageUrl, maxWidth = 800, quality = 0.7) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleFactor = maxWidth / img.width;
          canvas.width = maxWidth;
          canvas.height = img.height * scaleFactor;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              const compressedUrl = URL.createObjectURL(blob);
              resolve(compressedUrl);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
        img.src = imageUrl;
      });
    },
    []
  );

  return { compressImage };
};

export default useImageCompressor;
