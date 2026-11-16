import { type ApplicationManifest } from 'integracore-shared/application';

export const toGalleryImagePaths = (
  application: Partial<ApplicationManifest> | undefined,
): string[] => {
  const galleryImages = application?.galleryImages;

  if (galleryImages && galleryImages.length > 0) {
    return galleryImages;
  }

  return application?.screenshots ?? [];
};
