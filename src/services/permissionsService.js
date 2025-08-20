import * as ImagePicker from 'expo-image-picker';

export const checkPermissions = async () => {
  const cameraStatus = await ImagePicker.getCameraPermissionsAsync();
  const galleryStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
  return {
    camera: cameraStatus.status,
    gallery: galleryStatus.status,
  };
};

export const requestCameraPermission = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const requestGalleryPermission = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};
