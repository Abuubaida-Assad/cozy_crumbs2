import React, { useState, useRef } from 'react';

// Helper function to compress and resize images client-side before upload
const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP or JPEG
        const compressedDataUrl = canvas.toDataURL('image/webp', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function ImageUploader({
  value,
  onChange,
  presets = [],
  label = 'Product Photo',
}) {
  const [mode, setMode] = useState('upload'); // 'upload' | 'preset'
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Compress client-side
      const compressedBase64 = await compressImage(file);

      // 2. Set immediate preview / optimistic value
      onChange(compressedBase64);

      // 3. Attempt upload to backend
      const token = localStorage.getItem('cozy_crumbs_admin_token');
      if (token) {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              image: compressedBase64,
              filename: file.name,
            }),
          });
          const data = await res.json();
          if (data.success && data.url) {
            onChange(data.url);
          }
        } catch (apiErr) {
          console.warn('Backend upload fallback to data URL:', apiErr);
        }
      }
    } catch (err) {
      console.error('Failed to process image:', err);
      alert('Failed to process the image file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="block text-gray-700 font-bold text-xs">{label} *</label>
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              mode === 'upload'
                ? 'bg-white text-[#1B130E] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Upload From Device
          </button>
          <button
            type="button"
            onClick={() => setMode('preset')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              mode === 'preset'
                ? 'bg-white text-[#1B130E] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Presets / URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div>
          {/* Hidden native file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {value ? (
            /* Uploaded Preview with Replace button */
            <div className="flex items-center gap-4 p-3 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 shadow-xs">
                <img
                  src={value}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow min-w-0">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold mb-1">
                  <span>✓ Photo Selected</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate max-w-full">
                  {value.startsWith('data:') ? 'Custom photo from device' : value}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1 text-[11px] font-bold bg-white hover:bg-gray-100 text-[#1B130E] border border-gray-300 rounded-lg transition cursor-pointer"
                  >
                    {isUploading ? 'Uploading...' : 'Replace Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drag and Drop Box */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center ${
                dragActive
                  ? 'border-[#C06B3E] bg-[#C06B3E]/5'
                  : 'border-gray-300 hover:border-[#C06B3E] bg-gray-50/70 hover:bg-white'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-[#C06B3E] mb-2 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
              </div>
              <p className="text-xs font-bold text-[#1B130E]">
                {isUploading ? 'Uploading photo...' : 'Click to upload photo from your device'}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                or drag and drop your photo here (PNG, JPG, WebP)
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Preset & URL Mode */
        <div className="space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g. /images/products/cakes/chocolate-cake.webp or https://..."
            className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#C06B3E] font-medium text-xs"
          />

          {presets.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {presets.map((img) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => onChange(img.url)}
                  className={`p-1 rounded-lg border shrink-0 transition cursor-pointer ${
                    value === img.url
                      ? 'border-[#C06B3E] ring-2 ring-[#C06B3E]/30 bg-amber-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  title={img.label}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
