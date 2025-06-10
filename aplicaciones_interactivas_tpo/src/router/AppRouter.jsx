import { Navigate, Route, Routes } from "react-router-dom"
import { AuthRoutes } from "../auth/routes"
import { EcomerceRoutes } from "../ecomerce"
import { useContext } from "react"
import { AuthContext } from "../auth/context/AuthContext"
import { Box, CircularProgress } from "@mui/material"

export const AppRouter = () => {
    
  const { authState } = useContext(AuthContext);
  
  if ( authState.checking ) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
      <Routes>
        {
          ( authState.logged )
            ? <Route path="/*" element={ <EcomerceRoutes /> } />
            : <Route path="/auth/*" element={ <AuthRoutes /> } />
        }

         <Route path="/*" element={ <Navigate to="/auth/login" />} />
      </Routes>
    )
}