import { FaSync } from "react-icons/fa";
import { useGetPhotosQuery } from "../../api/photoApi";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { UploadButton } from "./UploadButton";
import { toast } from "react-toastify";

export function PhotoGallery() {
  const { data: photos, error, isLoading, refetch } = useGetPhotosQuery();

  const retryWithDelay = async (callback: () => void, delay = 1000) => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    callback();
  };

  const handleRetry = () => {
    toast.info("Retrying fetch...");
    retryWithDelay(refetch, 1500);
  };

  return (
    <div className="gallery">
      <div className="gallery__header">
        <div className="gallery__logo">
          <img src="/logo.png" alt="Logo" className="logo__image" />
        </div>
        <div className="gallery__controls">
          <button onClick={handleRetry} className="btn">
            <FaSync />
          </button>
          <UploadButton />
        </div>
      </div>

      {isLoading && <div className="loading-state">Loading photos...</div>}

      {error && (
        <div className="error-state">
          Failed to load photos
          <button onClick={handleRetry} className="btn">
            <FaSync />
          </button>
        </div>
      )}

      <div className="gallery__grid">
        {photos?.map((id) => (
          <PhotoThumbnail key={id} id={id} />
        ))}
      </div>

      {photos?.length === 0 && !isLoading && (
        <div className="loading-state">No photo found!</div>
      )}
    </div>
  );
}
