// AdminRoutes.jsx
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import NewProductPage from "../pages/NewProductPage";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminPage />} />
        <Route path="new-product" element={<NewProductPage />} />
        <Route path="edit-product/:id" element={<NewProductPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Route>
    </Routes>
  );
};

const AdminLayout = () => {
  return (
    <div>
      {/* Aquí podrías tener un sidebar, header, etc */}
      <Outlet />
    </div>
  );
};