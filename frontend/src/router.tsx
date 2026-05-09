import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Index from "./pages/Index";
import List from "./pages/note/List";
import Detail from "./pages/note/Detail";
import NotFound from "./pages/NotFound";
import User_New from "./pages/user/new.tsx";
import User_Login from "./pages/user/login.tsx";
import User_Logout from "./pages/user/logout.tsx";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: App,
      errorElement: <ErrorPage />,
      children: [
        { index: true, Component: Index, id: "top" },
        { path: "note/list", Component: List, id: "note_list" },
        { path: "note/detail/:id", Component: Detail, id: "note_detail" },
        { path: "user/new", Component: User_New, id: "user_new" },
        { path: "user/login", Component: User_Login, id: "user_login" },
        { path: "user/logout", Component: User_Logout, id: "user_logout" },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename: "/study-notes/" },
);
