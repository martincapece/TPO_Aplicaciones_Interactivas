// AdminRoutes.jsx
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AdminPage from "../pages/AdminPage";
import NewProductPage from "../pages/NewProductPage";
import ComprasPage from "../pages/ComprasPage";

export const AdminRoutes = () => {
  return (
    <Routes>
        <Route index element={<AdminPage />} />
        <Route path="new-product" element={<NewProductPage />} />
        <Route path="edit-product/:id" element={<NewProductPage />} />
        <Route path="compras" element={<ComprasPage />} />
        <Route path="*" element={<Navigate to="/admin" />} />
    </Routes>
  );
};