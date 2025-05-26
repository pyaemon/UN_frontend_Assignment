import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { useUploadPhotoMutation } from "../../api/photoApi";

export function UploadButton() {
  const [uploadPhoto, { isLoading }] = useUploadPhotoMutation();
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadPhoto({ file }).unwrap();
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError("");
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
