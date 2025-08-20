import { useState } from 'react';

// Handles camera permissions and image capture
export const useCamera = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [image, setImage] = useState(null);

  // TODO: Implement check permissions, take photo, pick image from gallery

  const takePhoto = async () => {};
  const pickImage = async () => {};
  const clearImage = () => setImage(null);

  return {
    cameraPermission,
    galleryPermission,
    image,
    takePhoto,
    pickImage,
    clearImage,
  };
};
