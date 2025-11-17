import { useState } from "react";
import { resourceAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UploadResource = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append("title", formData.title);
      uploadData.append("description", formData.description);
      uploadData.append("course", formData.course);
      uploadData.append("file", file);

      const response = await resourceAPI.upload(uploadData);

      if (response.data.success) {
        navigate("/resources");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Resource</h1>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Resource Title"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input
          type="text"
          name="course"
          value={formData.course}
          placeholder="Course ID (optional)"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <input type="file" onChange={handleFileChange} className="border p-2" required />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Resource"}
        </button>
      </form>
    </div>
  );
};

export default UploadResource;
