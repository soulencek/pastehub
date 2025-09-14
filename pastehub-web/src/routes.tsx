import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Home, HomeLoader } from "./pages/Home";
import { PasteDetails, PasteDetailsLoader } from "./pages/PasteDetails";
import { UserDetails, UserDetailsLoader } from "./pages/UserDetails";
import CreatePaste from "./pages/CreatePaste";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Profile, ProfileLoader} from "./pages/Profile";
import { UpdatePaste, UpdatePasteLoader} from "./pages/UpdatePaste";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectIfAuthenticated from "./components/RedirectIfAuthenticated";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Use App as a layout wrapper
    children: [
      { index: true, element: <Home />, loader: HomeLoader },
      { path: "paste/:id", element: <PasteDetails />, loader: PasteDetailsLoader },
      { path: "user/:id", element: <UserDetails />, loader: UserDetailsLoader },
      {
        path: "create",
        element: (
          <ProtectedRoute>
            <CreatePaste />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
        loader: ProfileLoader
      },
      {
        path: "edit/:id",
        element: (
          <ProtectedRoute>
            <UpdatePaste />
          </ProtectedRoute>
        ),
        loader: UpdatePasteLoader
      },
      {
        path: "login",
        element: (
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        ),
      },
      {
        path: "register",
        element: (
          <RedirectIfAuthenticated>
            <Register />
          </RedirectIfAuthenticated>
        ),
      },
    ],
  },
]);

export default router;
