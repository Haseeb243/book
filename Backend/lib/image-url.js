// Local storage only: return the stored image path/value without S3 signing
export async function resolveImageForResponse(storedImage) {
  if (!storedImage) {
    return {
      image: "",
      imageKey: null,
      imageOriginal: storedImage,
      imageSigned: false,
    };
  }

  return {
    image: storedImage,
    imageKey: null,
    imageOriginal: storedImage,
    imageSigned: false,
  };
}
