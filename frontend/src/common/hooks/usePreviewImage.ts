import { useState } from 'react';

const usePreviewImage = (initialCertificate?: string | null) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialCertificate ?? null,
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const updatePreviewUrl = (previewUrl: string) => {
    setPreviewUrl(previewUrl);
  };

  return { previewUrl, handleImageChange, updatePreviewUrl };
};

export default usePreviewImage;
