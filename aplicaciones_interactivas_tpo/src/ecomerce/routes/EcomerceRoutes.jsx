import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"
import CartItemList from "../components/CartItemList"

export const EcomerceRoutes = () => {
    
    
    return (
        <Routes>
            <Route path="inicio" element={ <EcomercePage /> } />
            <Route path="inicio/cart" element={ <CartItemList /> } />

            <Route path="/*" element={ <Navigate to="/inicio" />}/>
        </Routes>
    )
}
