"use client";

import React, { FC, useState } from "react";

interface ImageUploadProps {
  url: (urls: string[]) => void;
}

const ImageUpload: FC<ImageUploadProps> = ({ url }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        alert("Upload failed");
        setIsUploading(false);
        return;
      }

      const data = await res.json();
      url([data.url]); // returns array (consistent with your CreateProduct usage)

      alert("Upload Completed");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while uploading.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="p-8 max-w-lg w-full bg-background text-foreground rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Image Uploader
        </h2>

        <div className="mb-4 text-center">
          <p className="text-gray-600 mb-2">
            Please select an image to upload.
          </p>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-700 
                       file:mr-4 file:py-2 file:px-4 
                       file:rounded-full file:border-0 
                       file:text-sm file:font-semibold 
                       file:bg-blue-600 file:text-white 
                       hover:file:bg-blue-700 cursor-pointer"
          />

          {/* Upload Indicator */}
          {isUploading && (
            <p className="text-blue-600 font-medium mt-3">Uploading...</p>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-md mx-auto shadow"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
