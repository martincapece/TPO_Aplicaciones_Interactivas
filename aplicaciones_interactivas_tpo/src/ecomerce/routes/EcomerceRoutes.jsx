import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"
import Cart from "../../Cart/components/Cart"
import { Navbar } from "../components"

export const EcomerceRoutes = () => {
    
    return (
        <>
            <Navbar />
            
            <Routes>
                <Route path="inicio" element={ <EcomercePage /> } />
                <Route path="inicio/cart" element={ <Cart /> } />

                <Route path="/*" element={ <Navigate to="/inicio" />}/>
            </Routes>
        </>
    )
}
