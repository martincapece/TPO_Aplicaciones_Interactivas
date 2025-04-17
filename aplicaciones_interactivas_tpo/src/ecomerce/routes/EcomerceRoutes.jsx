import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"
import CartItem from "../components/CartItem"

export const EcomerceRoutes = () => {
    
    
    return (
        <Routes>
            <Route path="inicio" element={ <EcomercePage /> } />
            <Route path="inicio/cart" element={ <CartItem /> } />

            <Route path="/*" element={ <Navigate to="/inicio" />}/>
        </Routes>
    )
}
