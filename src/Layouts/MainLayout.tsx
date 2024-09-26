import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="w-full min-h-screen max-w-6xl mx-auto px-2 md:px-6">
      <Outlet />
    </div>
  );
};

export default MainLayout;
