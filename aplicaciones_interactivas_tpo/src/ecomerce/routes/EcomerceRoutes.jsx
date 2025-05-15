import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"
import Cart from "../../Cart/components/Cart"
import { Footer, Navbar } from "../components"
import SneakerPage from "../pages/SneakerPage"
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import { Nosotros } from "../pages/Nosotros"
import { Legales } from "../pages/Legales"
import { Catalogo } from "../pages/Catalogo"
import NewProductPage from "../../Admin/pages/NewProductPage"
import AdminPage from "../../Admin/pages/AdminPage"


export const EcomerceRoutes = () => {
    const location = useLocation();
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            
            <Navbar />
            
            <Box flex="1">
                <AnimatePresence mode="initial">
                    <Routes location={location} key={location.pathname}>
                        <Route path="inicio" element={<EcomercePage />} />
                        <Route path="inicio/cart" element={<Cart />} />
                        <Route path="admin" element={<AdminPage />} />
                        <Route path="admin/new-product" element={<NewProductPage />} />
                        <Route path="/admin/edit-product/:id" element={<NewProductPage />} />
                        <Route path="/producto/:id" element={<SneakerPage />} />
                        <Route path="/productos" element={<Catalogo />} />
                        <Route path="/nosotros/" element={<Nosotros />} />
                        <Route path="/legales/" element={<Legales />} />
                        <Route path="/catalogo/" element={<Catalogo />} />
                        <Route path="/*" element={<Navigate to="/inicio" />} />
                    </Routes>
                </AnimatePresence>
            </Box>

            <Footer />
            
        </Box>
    )
}
