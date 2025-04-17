import { Navigate, Route, Routes } from "react-router-dom"
import { AuthRoutes } from "../auth/routes"
import { EcomerceRoutes } from "../ecomerce"

export const AppRouter = () => {
    
  // const status = useCheckAuth() => HELPER: Con este verificariamos si el usuario esta logueado o no.

  return (
      <Routes>

        {/* 
          Si logramos conectar el status (sabemos el estado de autenticacion del usuario) vamos a guiralo directamente al ecommerce (esta logueado de antemano y no cerro sesion)
          o guiarlo hacia el login (no esta logueado o cerro sesion anteriormente) para que inicie sesion o se cree una cuenta.
        */}

         {/* <Route path="/auth/*" element={ <AuthRoutes /> } /> */}
         <Route path="/*" element={ <EcomerceRoutes /> } /> 
         
         {/* No descomentar EcomerceRoutes porque la app no va a funcionar (no enviara al usario al login)*/}

         <Route path="/*" element={ <Navigate to="/auth/login" />} />
      </Routes>
    )
}
