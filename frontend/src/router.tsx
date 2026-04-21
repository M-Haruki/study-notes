import { createBrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Index from "./pages/Index";
import List from "./pages/List";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: App,
      errorElement: <ErrorPage />,
      children: [
        { index: true, Component: Index, id: "top" },
        { path: "list", Component: List, id: "list" },
        { path: "detail/:id", Component: Detail, id: "detail" },
        { path: "*", Component: NotFound },
      ],
    },
  ],
  { basename: "/study-notes/" },
);
