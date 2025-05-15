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
import { useContext } from "react"
import { AdminRoutes } from "../../Admin/routes/AdminRoutes"
import { AuthContext } from "../../auth/context/AuthContext"


export const EcomerceRoutes = () => {
    
    const location = useLocation();
    const { authState } = useContext(AuthContext);

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            
            <Navbar />
            
            <Box flex="1">
                <AnimatePresence mode="initial">
                    <Routes location={location} key={location.pathname}>
                        <Route path="inicio" element={<EcomercePage />} />
                        <Route path="inicio/cart" element={<Cart />} />
                        <Route path="/producto/:id" element={<SneakerPage />} />
                        <Route path="/productos" element={<Catalogo />} />
                        <Route path="/nosotros/" element={<Nosotros />} />
                        <Route path="/legales/" element={<Legales />} />
                        <Route path="/catalogo/" element={<Catalogo />} />
                        
                        {authState.user.role === 'admin' && (
                            <Route path="/admin/*" element={<AdminRoutes />} />
                        )}
                        
                        <Route path="/*" element={<Navigate to="/inicio" />} />
                    </Routes>
                </AnimatePresence>
            </Box>

            <Footer />
            
        </Box>
    )
}
