import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useUploadPhotoMutation } from "../../api/photoApi";
import { toast } from "react-toastify";

export function UploadButton() {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadPhoto({ file }).unwrap();
      setError(null);
      toast.success("Uploaded Successfully");
    } catch (error) {
      setError("");
      toast.error(`Upload Failed: ${error.data.error || "Unknown error"}`);
    }
  };

  return (
    <div className="upload">
      <input
        type="file"
        id="photo-upload"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isLoading}
        className="upload__input"
      />
      <label htmlFor="photo-upload" className="btn btn--upload">
        <FaUpload style={{ paddingRight: 5 }} />
        {isLoading ? "Uploading..." : "Photo"}
      </label>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
