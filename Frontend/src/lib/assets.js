function getStaticBaseUrl() {
  const envBase = (import.meta.env.VITE_ASSET_BASE_URL || "").trim();
  const apiBase = (import.meta.env.VITE_API_BASE_URL || "").trim();
  const candidate = envBase || apiBase;

  if (candidate) {
    if (/\/api\/?$/i.test(candidate)) {
      return candidate.replace(/\/api\/?$/i, "/");
    }
    return candidate;
  }

  if (import.meta.env.DEV) {
    return "http://localhost:5000";
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "/";
}

export function resolveImageUrl(image) {
  if (!image) return "";

  const staticBase = getStaticBaseUrl();
  const staticBaseTrim = staticBase.endsWith("/")
    ? staticBase.slice(0, -1)
    : staticBase;

  const tryRelocateAbsolute = () => {
    try {
      const imageUrl = new URL(image);
      const baseUrl = new URL(staticBaseTrim);
      if (
        imageUrl.hostname === "localhost" ||
        imageUrl.hostname === "127.0.0.1" ||
        imageUrl.hostname === baseUrl.hostname
      ) {
        imageUrl.protocol = baseUrl.protocol;
        imageUrl.host = baseUrl.host;
        return imageUrl.toString();
      }
      return image;
    } catch (err) {
      return null;
    }
  };

  const relocatedAbsolute = tryRelocateAbsolute();
  if (relocatedAbsolute) {
    return relocatedAbsolute;
  }

  const isAbsolute =
    /^(https?:)?\/\//i.test(image) || image.startsWith("data:");
  if (isAbsolute) return image;

  const path = image.startsWith("/") ? image : `/${image}`;
  return `${staticBaseTrim}${path}`;
}
