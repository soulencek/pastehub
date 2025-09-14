import { useLoaderData, LoaderFunctionArgs, Link } from "react-router-dom";
import { Paste, getPasteByID } from "../services/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  UserCircleIcon,
  CalendarIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

// Loaders
const PasteDetailsLoader = async ({ params }: LoaderFunctionArgs) => {
  const id = params.id as string;
  return await getPasteByID(id);
};


const PasteDetails = () => {
  const paste = useLoaderData() as Paste;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{paste.title}</CardTitle>
            <CardDescription className="mt-2">
              Posted by <Link to={`/user/${paste.user.id}`} className="text-blue-500 hover:underline">{paste.user.username}</Link>
            </CardDescription>
          </div>
          <DocumentTextIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-8 md:grid-cols-2">
          {/* Content Section */}
          <div className="space-y-4">
            <div className="rounded-md bg-muted/50 p-4">
              <pre className="whitespace-pre-wrap font-sans">{paste.content}</pre>
            </div>
          </div>

          {/* Metadata Section */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-start space-x-4">
              <UserCircleIcon className="h-6 w-6 mt-1 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  <Link to={`/user/${paste.user.id}`} className="text-blue-500 hover:underline">
                    {paste.user.username}
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  Registered: {formatDate(paste.user.created_at)}
                </p>
              </div>
            </div>

            {/* Creation Date */}
            <div className="flex items-start space-x-4">
              <CalendarIcon className="h-6 w-6 mt-1 flex-shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(paste.created_at)}</p>
              </div>
            </div>

            {/* Edit Date (if exists) */}
            {paste.edited_at !== paste.created_at && (
              <div className="flex items-start space-x-4">
                <PencilIcon className="h-6 w-6 mt-1 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last edited</p>
                  <p className="text-sm text-muted-foreground">{formatDate(paste.edited_at)}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { PasteDetails, PasteDetailsLoader };
