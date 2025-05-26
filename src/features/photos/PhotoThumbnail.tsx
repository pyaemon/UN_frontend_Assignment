import { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import {
  useGetPhotoByIdQuery,
  useDeletePhotoMutation,
} from "../../api/photoApi";
import { PhotoViewModal } from "./PhotoViewModal";
import { toast } from "react-toastify";

interface PhotoThumbnailProps {
  id: string;
}

export function PhotoThumbnail({ id }: PhotoThumbnailProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: photoBlob, error, isLoading } = useGetPhotoByIdQuery(id);
  const [deletePhoto, { isLoading: isDeleting }] = useDeletePhotoMutation();

  if (isLoading)
    return <div className="thumbnail loading-state">Loading...</div>;

  if (error)
    return <div className="thumbnail error-state">Error loading photo</div>;

  const handleDelete = async () => {
    try {
      await deletePhoto(id).unwrap();
      toast.success("Deleted Successfully");
    } catch (error) {
      toast.error(`Delete Failed: ${error || "Unknown error"}`);
    }
  };
  return (
    <>
      <div className="thumbnail">
        <div
          className="thumbnail__image-container clickable"
          onClick={() => setIsModalOpen(true)}
        >
          {photoBlob && (
            <img
              src={URL.createObjectURL(photoBlob)}
              alt={`Photo ${id}`}
              className="thumbnail__image"
            />
          )}
        </div>
        <div className="thumbnail__actions">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="btn btn--danger btn--sm"
          >
            <FaTrash style={{ paddingRight: 5 }} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isDeleting}
            className="btn btn--primary btn--sm"
            style={{ marginLeft: "0.5rem" }}
          >
            <FaEye style={{ paddingRight: 5 }} /> View
          </button>
        </div>
      </div>

      {photoBlob && (
        <PhotoViewModal
          photoId={id}
          isOpen={isModalOpen}
          photoBlob={photoBlob}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
