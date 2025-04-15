import { Navigate, Route, Routes } from "react-router-dom"
import { EcomercePage } from "../pages"

export const EcomerceRoutes = () => {
    
    
    return (
        <Routes>
            <Route path="inicio" element={ <EcomercePage /> } />

            <Route path="/*" element={ <Navigate to="/inicio" />}/>
        </Routes>
    )
}
