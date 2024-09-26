import MainLayout from "@/Layouts/MainLayout";
import Home from "@/screens/Home";
import Preview from "@/screens/Preview";
import PreviewStream from "@/screens/PreviewStream";
import { Route, Routes } from "react-router-dom";

const Router = () => {
  return (
    <Routes>
      <Route path="" element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/preview-stream" element={<PreviewStream />} />
      </Route>
    </Routes>
  );
};

export default Router;
