
import { useLoaderData, LoaderFunctionArgs, useNavigate} from "react-router-dom";
import {  getUserByID, getPastesByUserID, PastesResponse , Paste, User} from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";


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

const UserDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;
  const user = await getUserByID(id);

  try {
      const pastesResponse: PastesResponse = await getPastesByUserID(id, 1, LIMIT);
      return { user, pastesResponse };
  } catch (error) {
      console.error("Failed to load pastes:", error);
      return { user, pastesResponse: { data: [], hasNextPage: false } };
  }
};


const UserDetails = () => {
    const { user, pastesResponse } = useLoaderData() as { user: User; pastesResponse: PastesResponse };
      const navigate = useNavigate();
      const [pastes, setPastes] = useState<Paste[]>(pastesResponse.data);
      const [page, setPage] = useState(2);
      const [loading, setLoading] = useState(false);
      const [hasMore, setHasMore] = useState(pastesResponse.hasNextPage);
    
      const fetchPastes = useCallback(async () => {
        if (loading || !hasMore) return;
    
        setLoading(true);
        try {
          const response = await getPastesByUserID(user.id, page, LIMIT);
          const newPastes = response.data;
    
          await setPastes((prev) => [...prev, ...newPastes]);
          await setHasMore(response.hasNextPage);
          await setPage((prev) => prev + 1);
        } catch (error) {
          console.error("Error fetching pastes:", error);
        }
        await setLoading(false);
      }, [loading, hasMore, user.id, page]);
    
      useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
      
        const handleScroll = () => {
          if (timeout) return;
      
          timeout = setTimeout(() => {
            if (
              window.innerHeight + window.scrollY >=
              document.documentElement.scrollHeight - 200
            ) {
              fetchPastes();
            }
            timeout = null;
          }, 300);
        };
      
        window.addEventListener("scroll", handleScroll);
        return () => {
          window.removeEventListener("scroll", handleScroll);
          if (timeout) clearTimeout(timeout);
        };
      }, [fetchPastes]);
    return (
      <Card className="max-w-2xl mx-auto mt-8 p-4">
        <CardHeader>
          <CardTitle className="text-2xl">{user.username}</CardTitle>
          <CardDescription className="mt-2">User Details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
          <h3 className="mt-4 text-xl font-semibold">User's Pastes:</h3>
          <Table>
        <TableCaption>A list of new pastes.</TableCaption>
        <TableHeader>
          <TableRow>
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
        </CardContent>
      </Card>
    );
  };
  export {UserDetails, UserDetailsLoader}