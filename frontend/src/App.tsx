import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";

import Index from "./pages/Index";
import List from "./pages/List";
import Detail from "./pages/Detail";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/list" element={<List />} />
        <Route path="/detail/:id" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}
