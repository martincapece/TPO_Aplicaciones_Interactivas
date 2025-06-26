import { Grid, Typography, Skeleton } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { SneakerCard } from "./SneakerCard";
import { ProductosContext } from "../context/ProductosContext";

export const Destacados = () => {
  const location = useLocation();
  const { productos, loading, errorProductos } = useContext(ProductosContext);

  // Scroll suave al hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [location]);

  // Mostrar skeletons mientras carga
  if (loading) {
    return (
      <>
        <Typography
          variant="h2"
          id="destacados"
          sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}
        >
          DESTACADOS
        </Typography>

        <Grid container spacing={2} direction="row">
          {[...Array(6)].map((_, index) => (
            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={index}>
              <Skeleton variant="rectangular" sx={{ aspectRatio: '1', borderRadius: 1, mb: 1 }} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="70%" />
            </Grid>
          ))}
        </Grid>
      </>
    );
  }

  if (errorProductos) {
    return <Typography variant="h6" color="error">Error al cargar productos</Typography>;
  }

  if (!Array.isArray(productos)) {
    return <Typography variant="h6" color="error">Datos inválidos</Typography>;
  }

  const productosDestacados = productos.filter(p => p.destacado);

  return (
    <>
      <Typography
        variant="h2"
        id="destacados"
        sx={{ fontSize: '45px', fontFamily: 'Inter', fontWeight: 800, my: 10 }}
      >
        DESTACADOS
      </Typography>

      <Grid container spacing={2} direction="row">
        {productosDestacados.map(sneaker => (
          <SneakerCard key={sneaker.sku} {...sneaker} />
        ))}
      </Grid>
    </>
  );
};
