import { Navigate, Route, Routes } from "react-router-dom"
import { AuthRoutes } from "../auth/routes"
import { EcomerceRoutes } from "../ecomerce"
import { useContext } from "react"
import { AuthContext } from "../auth/context/AuthContext"

export const AppRouter = () => {
    
  const { authState } = useContext(AuthContext);

  return (
      <Routes>


        {
          ( !!authState.user )
            ? <Route path="/*" element={ <EcomerceRoutes /> } />
            : <Route path="/auth/*" element={ <AuthRoutes /> } />
        }

         <Route path="/*" element={ <Navigate to="/auth/login" />} />
      </Routes>
    )
}