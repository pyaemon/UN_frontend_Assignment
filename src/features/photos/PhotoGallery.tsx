import { FaSync } from "react-icons/fa";
import { useGetPhotosQuery } from "../../api/photoApi";
import { PhotoThumbnail } from "./PhotoThumbnail";
import { UploadButton } from "./UploadButton";

export function PhotoGallery() {
  const { data: photos, error, isLoading, refetch } = useGetPhotosQuery();

  return (
    <div className="gallery">
      <div className="gallery__header">
        <div className="gallery__logo">
          <img src="/logo.png" alt="Logo" className="logo__image" />
        </div>
        <div className="gallery__controls">
          <button onClick={refetch} className="btn">
            <FaSync />
          </button>
          <UploadButton />
        </div>
      </div>

      {isLoading && <div className="loading-state">Loading photos...</div>}

      {error && (
        <div className="error-state">
          Failed to load photos
          <button onClick={refetch} className="btn">
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
