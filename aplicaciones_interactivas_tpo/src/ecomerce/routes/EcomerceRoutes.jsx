import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"
import Cart from "../../Cart/components/Cart"
import AdminDashboard from "../components/AdminDashboard"

export const EcomerceRoutes = () => {
    
    
    return (
        <Routes>
            <Route path="inicio" element={ <EcomercePage /> } />
            <Route path="inicio/cart" element={ <Cart /> } />
            <Route path="inicio/admin" element={ <AdminDashboard /> } />

            <Route path="/*" element={ <Navigate to="/inicio" />}/>
        </Routes>
    )
}
