"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { AuthContext } from "../../auth/context/AuthContext"

export const ProductosContext = createContext()

export const ProductosProvider = ({ children }) => {
  // Estados para productos
  const [productos, setProductos] = useState([])
  const [loadingProductos, setLoadingProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState(null)

  // Estados para talles (organizados por SKU)
  const [productoTalles, setProductoTalles] = useState({})
  const [loadingTalles, setLoadingTalles] = useState(false)
  const [errorTalles, setErrorTalles] = useState(null)
  // Estados para imágenes principales (organizadas por SKU)
  const [imagenesPrincipales, setImagenesPrincipales] = useState({})
  const [loadingImagenes, setLoadingImagenes] = useState(false)
  const [errorImagenes, setErrorImagenes] = useState(null)
  const [imagenesConError, setImagenesConError] = useState(new Set()) // SKUs con error definitivo

  // Estado general de carga
  const [loading, setLoading] = useState(false)
  const [datosYaCargados, setDatosYaCargados] = useState(false)  // Obtener datos del contexto de autenticación
  const authContext = useContext(AuthContext)

  const authState = authContext?.authState
  const isAuthenticated = authState?.logged || false
  const token = authState?.user?.token

  // Función para validar que el token sea válido
  const validarToken = () => {
    if (!token) {
      return false
    }

    if (token.trim().length === 0) {
      return false
    }    return true
  }
  
  useEffect(() => {
    // Solo ejecutar si:
    // 1. El contexto de auth está disponible
    // 2. El usuario está autenticado (logged = true)
    // 3. Tenemos un token válido
    // 4. Los datos no han sido cargados aún
    // 5. No estamos ya cargando datos
    if (authContext && isAuthenticated && validarToken() && !datosYaCargados && !loading) {
      fetchTodosLosDatos()
    }
  }, [authContext, isAuthenticated, token, datosYaCargados, loading]) // Se ejecuta cuando cambia el estado de auth

  // Función para cargar imágenes progresivamente
  const cargarImagenesProgresivamente = (productosData) => {
    setLoadingImagenes(true)
      // Inicializar el objeto de imágenes vacío (null = cargando, 'ERROR' = error definitivo, objeto = cargada)
    const imagenesOrganizadas = {}
    productosData.forEach(producto => {
      imagenesOrganizadas[producto.sku] = null // null = estado de carga inicial
    })
    setImagenesPrincipales(imagenesOrganizadas)

    // Crear las promesas pero no esperar a todas
    productosData.forEach(async (producto) => {
      try {
        const response = await fetch(`http://localhost:8080/api/imagenes/${producto.sku}/principal`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const imagen = await response.json()
          // Actualizar inmediatamente cuando la imagen esté lista
          setImagenesPrincipales(prev => ({
            ...prev,
            [producto.sku]: imagen
          }))        } else {
          // Marcar como error definitivo
          setImagenesConError(prev => new Set([...prev, producto.sku]))
          setImagenesPrincipales(prev => ({
            ...prev,
            [producto.sku]: 'ERROR' // Marcador especial para error
          }))
        }
      } catch (error) {
        // Marcar como error definitivo
        setImagenesConError(prev => new Set([...prev, producto.sku]))
        setImagenesPrincipales(prev => ({
          ...prev,
          [producto.sku]: 'ERROR' // Marcador especial para error
        }))
      }
    })

    // Marcar que ya no estamos cargando imágenes después de un breve momento
    setTimeout(() => {
      setLoadingImagenes(false)
    }, 500)
  }

  // Función para cargar talles progresivamente
  const cargarTallesProgresivamente = (productosData) => {
    setLoadingTalles(true)
    
    // Inicializar el objeto de talles vacío
    const tallesOrganizados = {}
    productosData.forEach(producto => {
      tallesOrganizados[producto.sku] = [] // Inicializar como array vacío
    })
    setProductoTalles(tallesOrganizados)

    // Crear las promesas pero no esperar a todas
    productosData.forEach(async (producto) => {
      try {
        const response = await fetch(`http://localhost:8080/sapah/productos-talles/${producto.sku}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const talles = await response.json()
          // Actualizar inmediatamente cuando los talles estén listos
          setProductoTalles(prev => ({
            ...prev,
            [producto.sku]: talles
          }))
        } else {
          // Dejar como array vacío
          setProductoTalles(prev => ({
            ...prev,
            [producto.sku]: []
          }))
        }
      } catch (error) {
        // Dejar como array vacío
        setProductoTalles(prev => ({
          ...prev,
          [producto.sku]: []
        }))
      }
    })    // Marcar que ya no estamos cargando talles después de un breve momento
    setTimeout(() => {
      setLoadingTalles(false)
    }, 500)
  }

  const fetchTodosLosDatos = async () => {
    try {
      // Validar que tenemos un token válido antes de empezar
      if (!validarToken()) {
        return
      }

      setLoading(true)

      // PASO 1: Obtener todos los productos (CON TOKEN)
      const productosResponse = await fetch("http://localhost:8080/sapah/productos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!productosResponse.ok) {
        throw new Error(`Error obteniendo productos: ${productosResponse.status}`)
      }

      const productosData = await productosResponse.json()

      if (!Array.isArray(productosData)) {
        throw new Error("La respuesta de productos no es un array.")
      }

      setProductos(productosData)
      setLoadingProductos(false)

      // Cargar imágenes y talles de forma progresiva
      cargarImagenesProgresivamente(productosData)
      cargarTallesProgresivamente(productosData)      // Marcar que los datos ya fueron cargados (productos están listos)
      // Las imágenes y talles se cargarán progresivamente
      setDatosYaCargados(true)
      setLoading(false) // El proceso principal está completo

    } catch (err) {
      manejarErrorAuth(err, "carga de datos")
      setErrorProductos(err)
      setErrorTalles(err)
      setErrorImagenes(err)
    } finally {
      // Solo limpiar el loading general y de productos
      // Las imágenes y talles tienen su propio ciclo de vida
      setLoading(false)
      setLoadingProductos(false)
    }
  }

  // Función para recargar datos manualmente (útil después del login)
  const recargarDatos = () => {
    if (isAuthenticated && token) {
      setDatosYaCargados(false)
      // El useEffect se encargará de recargar automáticamente
    }
  }
  // Función para limpiar datos al hacer logout
  const limpiarDatos = () => {
    setProductos([])
    setProductoTalles({})
    setImagenesPrincipales({})
    setImagenesConError(new Set())
    setDatosYaCargados(false)
    setErrorProductos(null)
    setErrorTalles(null)
    setErrorImagenes(null)
  }

  // Limpiar datos cuando el usuario se desloguea
  useEffect(() => {
    if (!isAuthenticated) {
      limpiarDatos()
    }
  }, [isAuthenticated])
  // Funciones helper para obtener datos específicos
  const getTallesPorSku = (sku) => {
    return productoTalles[sku] || []
  }

  const getImagenPrincipalPorSku = (sku) => {
    return imagenesPrincipales[sku] || null
  }

  // Función para determinar el estado de la imagen
  const getEstadoImagenPorSku = (sku) => {
    const imagen = imagenesPrincipales[sku]
    if (imagen === null) return 'cargando'  // null = cargando
    if (imagen === 'ERROR') return 'error'  // 'ERROR' = error definitivo
    return 'cargada'  // objeto = imagen cargada
  }

  // Función para obtener todos los talles únicos disponibles
  const getTallesDisponibles = () => {
    const todosLosTalles = Object.values(productoTalles).flat()
    const tallesUnicos = [...new Set(todosLosTalles.map((pt) => pt.talle.numero))]
    return tallesUnicos.sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
  }
  // Función para verificar si un producto tiene stock en un talle específico
  const tieneStockEnTalle = (sku, numeroTalle) => {
    const talles = getTallesPorSku(sku)
    return talles.some((pt) => pt.talle.numero === numeroTalle && pt.stock > 0)
  }

  // Función para manejar errores de autenticación
  const manejarErrorAuth = (error, operacion) => {
    
    // Si el error es 401 o 403, significa que el token expiró o es inválido
    if (error.message.includes('401') || error.message.includes('403')) {
      limpiarDatos()
      // Podrías también disparar un logout aquí si tienes acceso al contexto de auth
    }
  }

  const value = {
    // Datos principales
    productos,
    productoTalles,
    imagenesPrincipales,

    // Estados de carga
    loading,
    loadingProductos,
    loadingTalles,
    loadingImagenes,

    // Estados de error
    errorProductos,
    errorTalles,
    errorImagenes,

    // Estados adicionales
    datosYaCargados,
    isAuthenticated,    // Funciones helper
    getTallesPorSku,
    getImagenPrincipalPorSku,
    getEstadoImagenPorSku,
    getTallesDisponibles,
    tieneStockEnTalle,
    recargarDatos,
    limpiarDatos,
  }

  return <ProductosContext.Provider value={value}>{children}</ProductosContext.Provider>
}
