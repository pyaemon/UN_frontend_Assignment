import { useState, useEffect } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  useGetPhotoMetadataQuery,
  useUpdatePhotoMetadataMutation,
} from "../../api/photoApi";

// Set app element for accessibility
Modal.setAppElement("#root");

interface PhotoModalProps {
  isOpen: boolean;
  photoId: string;
  photoBlob: Blob;
  onClose: () => void;
}

export function PhotoViewModal({
  isOpen,
  photoId,
  photoBlob,
  onClose,
}: PhotoModalProps) {
  const [tagsInput, setTagsInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const { data: metadata } = useGetPhotoMetadataQuery(photoId);
  const [updateMetadata] = useUpdatePhotoMetadataMutation();

  useEffect(() => {
    if (metadata) {
      setTagsInput(metadata.tags?.join(", ") || "");
    }
  }, [metadata]);

  const handleSave = async () => {
    try {
      await updateMetadata({
        id: photoId,
        metadata: {
          tags: tagsInput
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
          updatedAt: new Date().toISOString(),
        },
      }).unwrap();
      setIsEditing(false);
      toast.success("Updated Successfully");
    } catch (error) {
      toast.error(`Failed to update: ${error.data.error || "Unknown error"}`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Photo Details"
      className="modal__content"
      overlayClassName="modal"
    >
      <button className="modal__close" onClick={onClose}>
        &times;
      </button>

      <div className="modal__body">
        <div className="modal__image-container">
          <img
            src={URL.createObjectURL(photoBlob)}
            alt={`Photo ${photoId}`}
            className="modal__image"
          />
        </div>

        <div className="modal__metadata">
          <h3 className="modal__title">Photo Details</h3>

          <div className="metadata">
            <div className="metadata__row">
              <span className="metadata__label">ID: {""}</span>
              <span className="metadata__value">{photoId}</span>
            </div>

            <div className="metadata__row">
              <span className="metadata__label">Last Updated: {""}</span>
              <span className="metadata__value">
                {metadata?.updatedAt
                  ? new Date(metadata.updatedAt).toLocaleString()
                  : "Unknown"}
              </span>
            </div>

            <div className="metadata__row">
              <span className="metadata__label">Tags: {""}</span>
              {isEditing ? (
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="Comma-separated tags"
                  className="input"
                />
              ) : (
                <span className="metadata__value">
                  {metadata?.tags?.join(", ") || "No tags"}
                </span>
              )}
            </div>

            <div className="modal__actions">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="btn btn--success">
                    <FaSave style={{ paddingRight: 5 }} /> Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setTagsInput(metadata?.tags?.join(", ") || "");
                    }}
                    className="btn btn--danger"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn--primary"
                >
                  <FaEdit style={{ paddingRight: 5 }} /> Tags
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
