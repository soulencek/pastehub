import { useState } from "react";
import { useLoaderData, useNavigate, LoaderFunctionArgs } from "react-router-dom";
import { getPasteByID, updatePaste , Paste} from "../services/api";

// Loader function to fetch paste details
const UpdatePasteLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;
  if (!id) throw new Error("Invalid paste ID.");

  const paste = await getPasteByID(id);
  if (!paste) throw new Response("Paste not found.", { status: 404 });

  return paste;
};

const UpdatePaste = () => {
  const paste = useLoaderData() as Paste;
  const navigate = useNavigate();

  const [title, setTitle] = useState(paste.title);
  const [content, setContent] = useState(paste.content);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await updatePaste(paste.id, { title, content });
      navigate(`/paste/${paste.id}`);
    } catch (err) {
      setError("Failed to update paste. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Paste</h1>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            className="w-full mt-1 p-2 border rounded-md"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium">Content</label>
          <textarea
            className="w-full mt-1 p-2 border rounded-md h-40"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};
export {UpdatePaste, UpdatePasteLoader}