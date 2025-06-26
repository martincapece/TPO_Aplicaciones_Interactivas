import { Grid, Box } from "@mui/material"
import { Destacados, Footer, ImageBackground, ImageBackgroundChild, Navbar } from "../components"
import { useNavigate } from "react-router-dom"
import { useState, useEffect, useContext, useMemo } from "react"
import { ProductosContext } from "../context/ProductosContext"
import vans from "/assets/vans_knu.png"
import jordan from "/assets/jordans.png"
import nike from "/assets/nikes.png"
import adidas from "/assets/adidas.png"
import asics from "/assets/asics.png"
import hoka from "/assets/hoka.png"
import new_balance from "/assets/new_balance.png"
import reebok from "/assets/reebok.png"

export const EcomercePage = () => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const { productos, loadingProductos } = useContext(ProductosContext)
  
  const marcasDisponibles = !loadingProductos ? [...new Set(productos.flatMap((p) => p.marca))] : []

  const handleCategoryClick = (marca) => {
    localStorage.setItem("selectedBrand", marca);
    navigate('/productos');
  }

  // Mapeo de imágenes por marca
  const imagenesPorMarca = {
    "Jordan": jordan,
    "Vans": vans,
    "Nike": nike,
    "Adidas": adidas,
    "Asics": asics,
    "Hoka": hoka,
    "New Balance": new_balance,
    "Reebok": reebok
  }

  // Crear categorías dinámicamente usando tu marcasDisponibles
  const categorias = useMemo(() => {
    if (loadingProductos || marcasDisponibles.length === 0) {
      // Fallback mientras carga
      return [
        { nombre: "Jordan", imagen: jordan },
        { nombre: "Vans", imagen: vans },
        { nombre: "Nike", imagen: nike },
        { nombre: "Adidas", imagen: adidas },
        { nombre: "Asics", imagen: asics },
        { nombre: "Hoka", imagen: hoka },
        { nombre: "New Balance", imagen: new_balance },
        { nombre: "Reebok", imagen: reebok }
      ]
    }

    return marcasDisponibles.map(marca => ({
      nombre: marca,
      imagen: imagenesPorMarca[marca] // Imagen por defecto
    }))
  }, [marcasDisponibles, loadingProductos])

  // Auto-scroll del carrusel
  useEffect(() => {
    if (categorias.length <= 2) return // No hacer scroll si hay 2 o menos

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % (categorias.length - 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [categorias.length])

  // Obtener las 2 categorías actuales a mostrar
  const categoriasActuales = useMemo(() => {
    if (categorias.length <= 2) {
      return categorias // Mostrar todas si hay 2 o menos
    }
    
    return [
      categorias[currentIndex],
      categorias[(currentIndex + 1) % categorias.length]
    ]
  }, [categorias, currentIndex])

  return (
    <>
      <ImageBackground title={'NUEVA COLECCIÓN'} subtitle={'VER PRODUCTOS'} />
      
      <Grid
      container
      sx={{backgroundColor: '#eaeaea'}}
      >
        <Grid
        sx={{
          width: '100%',
          maxWidth: '80%',
          margin: '0 auto'
        }}
        >
          
          {/* DESTACADOS */}
          <Grid>
            <Destacados />
          </Grid>

          {/* CARROUSEL DE CATEGORIAS */}
          <Grid
          container
          direction='row'
          justifyContent='space-between'
          sx={{ my: 10 }}
          >
            {categoriasActuales.map((categoria, index) => (
              <Grid
                key={`${categoria.nombre}-${currentIndex}-${index}`}
                size={{ xs: 12, md: 5.75 }}
                sx={{ 
                  my: { xs: 1, md: 0 },
                  animation: 'fadeIn 0.6s ease-in-out',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                  },
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
                onClick={() => handleCategoryClick(categoria.nombre)}
              >
                <ImageBackgroundChild 
                  title={categoria.nombre.toUpperCase()} 
                  subtitle={'VER PRODUCTOS'} 
                  url={categoria.imagen} 
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
