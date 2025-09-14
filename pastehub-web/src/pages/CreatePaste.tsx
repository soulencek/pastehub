import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPaste } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CreatePaste = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newPaste = await createPaste({ title, content });
      console.log(newPaste)
      navigate(`/paste/${newPaste.id}`);
    } catch (error) {
      console.error("Error creating paste:", error);
    }

    setLoading(false);
  };

  return (
    <div className="mt-6 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a New Paste</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea
          placeholder="Paste your content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Paste"}
        </Button>
      </form>
    </div>
  );
};

export default CreatePaste;
