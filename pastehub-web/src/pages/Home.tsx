import { Loader2 } from "lucide-react";
import { getPastes, Paste } from "../services/api";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const LIMIT = 50;


function formatDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}


const HomeLoader = async () => {
    try {
      return await getPastes(1, LIMIT);
    } catch (error) {
      console.error("Failed to load pastes:", error);
      return { data: [], hasNextPage: false };
    }
  };
  

const Home = () => {
  const navigate = useNavigate();
  const { data, hasNextPage } = useLoaderData() as { data: Paste[]; hasNextPage: boolean };
  const [pastes, setPastes] = useState<Paste[]>(data);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(hasNextPage);

  const fetchPastes = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await getPastes(page, LIMIT);
      const newPastes = response.data;

      await setPastes((prev) => [...prev, ...newPastes]);
      await setHasMore(response.hasNextPage);
      await setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching pastes:", error);
    }
    await setLoading(false);
  }, [page, loading, hasMore]);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
  
    const handleScroll = () => {
      if (timeout) return; // Prevent multiple calls
  
      timeout = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 200
        ) {
          fetchPastes();
        }
        timeout = null;
      }, 300); // Throttle to 300ms
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeout) clearTimeout(timeout);
    };
  }, [fetchPastes]);
  
  return (
    <div>
      <Table>
        <TableCaption>A list of new pastes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Publisher</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Edited</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pastes.map((paste) => {
            const createdAt = formatDate(paste.created_at);
            const editedAt = paste.created_at === paste.edited_at ? "-" : formatDate(paste.edited_at);

            return (
              <TableRow
                key={paste.id}
                onClick={() => navigate(`/paste/${paste.id}`)}
                className="cursor-pointer hover:bg-gray-100 transition"
              >
                <TableCell className="font-medium">{paste.user.username}</TableCell>
                <TableCell>{paste.title}</TableCell>
                <TableCell className="text-right">{editedAt}</TableCell>
                <TableCell className="text-right">{createdAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      )}
    </div>
  );
};

export {HomeLoader, Home};
