"use client"

import { createContext, useState, useEffect, useContext, useCallback } from "react"
import { AuthContext } from "../../auth/context/AuthContext"

export const ProductosContext = createContext()

export const ProductosProvider = ({ children }) => {
  // Estados existentes...
  const [productos, setProductos] = useState([])
  const [loadingProductos, setLoadingProductos] = useState(false)
  const [errorProductos, setErrorProductos] = useState(null)

  const [productoTalles, setProductoTalles] = useState({})
  const [loadingTalles, setLoadingTalles] = useState(false)
  const [errorTalles, setErrorTalles] = useState(null)

  const [imagenesPrincipales, setImagenesPrincipales] = useState({})
  const [loadingImagenes, setLoadingImagenes] = useState(false)
  const [errorImagenes, setErrorImagenes] = useState(null)
  const [imagenesConError, setImagenesConError] = useState(new Set())

  // NUEVO: Sistema de caché de imágenes por producto (bajo demanda)
  const [imagenesProductoCache, setImagenesProductoCache] = useState({}) // {sku: {imagenes: [], estado: 'cargando'|'cargado'|'error'}}
  const [imagenesProductoCargando, setImagenesProductoCargando] = useState(new Set()) // SKUs que están cargando

  // Estados generales...
  const [loading, setLoading] = useState(false)
  const [datosYaCargados, setDatosYaCargados] = useState(false)

  // Contexto de auth...
  const authContext = useContext(AuthContext)
  const authState = authContext?.authState
  const isAuthenticated = authState?.logged || false
  const token = authState?.user?.token

  const validarToken = () => {
    if (!token) return false
    if (token.trim().length === 0) return false
    return true
  }

  // NUEVA: Función para cargar imágenes de un producto específico (bajo demanda)
  const cargarImagenesProducto = useCallback(async (sku) => {
    const skuStr = sku.toString()
    
    // Si ya están cargadas o cargando, no hacer nada
    if (imagenesProductoCache[skuStr] || imagenesProductoCargando.has(skuStr)) {
      return
    }

    // Si no hay token, no cargar
    if (!validarToken()) {
      return
    }

    try {
      // Marcar como cargando
      setImagenesProductoCargando(prev => new Set([...prev, skuStr]))
      
      // Establecer estado inicial
      setImagenesProductoCache(prev => ({
        ...prev,
        [skuStr]: {
          imagenes: [],
          estado: 'cargando'
        }
      }))

      const response = await fetch(`http://localhost:8080/api/imagenes/${sku}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        const imagenesData = await response.json()
        
        // Actualizar caché con imágenes cargadas
        setImagenesProductoCache(prev => ({
          ...prev,
          [skuStr]: {
            imagenes: imagenesData,
            estado: 'cargado'
          }
        }))

      } else {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      
      // Marcar como error
      setImagenesProductoCache(prev => ({
        ...prev,
        [skuStr]: {
          imagenes: [],
          estado: 'error'
        }
      }))
    } finally {
      // Quitar de la lista de cargando
      setImagenesProductoCargando(prev => {
        const newSet = new Set(prev)
        newSet.delete(skuStr)
        return newSet
      })
    }
  }, [token, imagenesProductoCache, imagenesProductoCargando])

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
          }))
        } else {
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
    })
    
    // Marcar que ya no estamos cargando talles después de un breve momento
    setTimeout(() => {
      setLoadingTalles(false)
    }, 500)
  }

  // Función principal (sin cargar todas las imágenes)
  const fetchTodosLosDatos = async () => {
    if (loading || datosYaCargados) return

    try {
      setLoading(true)

      // 1. Cargar productos
      setLoadingProductos(true)
      const productosResponse = await fetch("http://localhost:8080/sapah/productos", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!productosResponse.ok) {
        throw new Error("Error al cargar productos")
      }

      const productosData = await productosResponse.json()
      setProductos(productosData)
      setLoadingProductos(false)

      if (productosData.length > 0) {
        // 2. Cargar imágenes principales (para catálogo)
        cargarImagenesProgresivamente(productosData)
        
        // 3. Cargar talles (para filtros y stock)
        cargarTallesProgresivamente(productosData)
        
        // 4. NO cargar todas las imágenes automáticamente
      }

      setDatosYaCargados(true)

    } catch (error) {
      setErrorProductos(error.message)
    } finally {
      setLoading(false)
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
    setImagenesProductoCache({}) // NUEVO: Limpiar caché de imágenes
    setImagenesProductoCargando(new Set()) // NUEVO: Limpiar estado de carga
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

  // Funciones helper existentes...
  const getTallesPorSku = (sku) => {
    return productoTalles[sku] || []
  }

  const getImagenPrincipalPorSku = (sku) => {
    return imagenesPrincipales[sku] || null
  }

  const getEstadoImagenPorSku = (sku) => {
    const imagen = imagenesPrincipales[sku]
    if (imagen === null) return 'cargando'
    if (imagen === 'ERROR') return 'error'
    return 'cargada'
  }

  // AGREGAR: Función para obtener todos los talles únicos disponibles
  const getTallesDisponibles = () => {
    const todosLosTalles = Object.values(productoTalles).flat()
    const tallesUnicos = [...new Set(todosLosTalles.map((pt) => pt.talle.numero))]
    return tallesUnicos.sort((a, b) => Number.parseFloat(a) - Number.parseFloat(b))
  }

  // AGREGAR: Función para verificar si un producto tiene stock en un talle específico
  const tieneStockEnTalle = (sku, numeroTalle) => {
    const talles = getTallesPorSku(sku)
    return talles.some((pt) => pt.talle.numero === numeroTalle && pt.stock > 0)
  }

  // AGREGAR: Función para manejar errores de autenticación
  const manejarErrorAuth = (error, operacion) => {
    // Si el error es 401 o 403, significa que el token expiró o es inválido
    if (error.message.includes('401') || error.message.includes('403')) {
      limpiarDatos()
      // Podrías también disparar un logout aquí si tienes acceso al contexto de auth
    }
  }

  // NUEVAS: Funciones para el caché de imágenes por producto
  const getImagenesProductoPorSku = useCallback((sku) => {
    if (!sku) return []
    
    const skuStr = sku.toString()
    const cacheData = imagenesProductoCache[skuStr]
    
    if (!cacheData || cacheData.estado !== 'cargado') {
      return []
    }
    
    return cacheData.imagenes
  }, [imagenesProductoCache])

  const getEstadoImagenesProducto = useCallback((sku) => {
    if (!sku) return 'sin-datos'
    
    const skuStr = sku.toString()
    const cacheData = imagenesProductoCache[skuStr]
    
    if (!cacheData) return 'no-cargado'
    
    return cacheData.estado // 'cargando', 'cargado', 'error'
  }, [imagenesProductoCache])

  const hayImagenesSecundariasProducto = useCallback((sku) => {
    const imagenes = getImagenesProductoPorSku(sku)
    return imagenes.length > 1
  }, [getImagenesProductoPorSku])

  // Hook para solicitar carga de imágenes (para usar en componentes)
  const solicitarImagenesProducto = useCallback((sku) => {
    if (sku) {
      cargarImagenesProducto(sku)
    }
  }, [cargarImagenesProducto])

  // NUEVAS: Funciones para actualizar datos localmente (para admin)
  const actualizarProductoLocal = useCallback((sku, datosActualizados) => {
    setProductos(prev => 
      prev.map(producto => 
        producto.sku === sku 
          ? { ...producto, ...datosActualizados }
          : producto
      )
    )
  }, [])

  const agregarProductoLocal = useCallback((nuevoProducto) => {
    console.log('🔄 agregandoProductoLocal:', nuevoProducto);
    
    // ✅ VERIFICAR QUE EL PRODUCTO NO EXISTA YA
    setProductos(prev => {
      const productoExistente = prev.find(p => p.sku === nuevoProducto.sku);
      if (productoExistente) {
        console.warn('⚠️ Producto ya existe con SKU:', nuevoProducto.sku);
        return prev; // No agregar duplicado
      }
      
      console.log('✅ Agregando nuevo producto con SKU:', nuevoProducto.sku);
      return [...prev, nuevoProducto];
    });
  }, [])

  const eliminarProductoLocal = useCallback((sku) => {
    console.log('🗑️ Eliminando producto del contexto local:', sku);
    
    setProductos(prev => prev.filter(producto => producto.sku !== sku))
    
    // También limpiar datos relacionados
    setProductoTalles(prev => {
      const { [sku]: removed, ...rest } = prev
      return rest
    })
    
    setImagenesPrincipales(prev => {
      const { [sku]: removed, ...rest } = prev
      return rest
    })
    
    setImagenesProductoCache(prev => {
      const { [sku]: removed, ...rest } = prev
      return rest
    })
    
    console.log('✅ Producto eliminado del contexto local');
  }, [])

  const actualizarStockLocal = useCallback((sku, nuevoStock) => {
    setProductoTalles(prev => ({
      ...prev,
      [sku]: prev[sku]?.map(talleData => ({
        ...talleData,
        stock: nuevoStock[talleData.talle.numero] || talleData.stock
      })) || []
    }))
  }, [])

  const actualizarStockPorCompra = useCallback((itemsCompra) => {
    itemsCompra.forEach(item => {
      setProductoTalles(prev => ({
        ...prev,
        [item.sku]: prev[item.sku]?.map(talleData => 
          talleData.talle.numero.toString() === item.talle.toString()
            ? { ...talleData, stock: Math.max(0, talleData.stock - item.cantidad) }
            : talleData
        ) || []
      }))
    })
  }, [])

  // useEffect existente...
  useEffect(() => {
    if (authContext && isAuthenticated && validarToken() && !datosYaCargados && !loading) {
      fetchTodosLosDatos()
    }
  }, [authContext, isAuthenticated, token, datosYaCargados, loading])

  // Valor del contexto
  const contextValue = {
    // Estados existentes
    productos,
    loadingProductos,
    errorProductos,
    
    productoTalles,
    loadingTalles,
    errorTalles,
    
    imagenesPrincipales,
    loadingImagenes,
    errorImagenes,
    imagenesConError,
    
    // Estados generales
    loading,
    datosYaCargados,
    isAuthenticated,
    
    // Funciones existentes
    getTallesPorSku,
    getImagenPrincipalPorSku,
    getEstadoImagenPorSku,
    getTallesDisponibles,
    tieneStockEnTalle,
    
    // NUEVAS: Funciones para caché de imágenes por producto
    getImagenesProductoPorSku,
    getEstadoImagenesProducto,
    hayImagenesSecundariasProducto,
    solicitarImagenesProducto,
    
    // NUEVAS: Funciones para admin
    actualizarProductoLocal,
    agregarProductoLocal,
    eliminarProductoLocal,
    actualizarStockLocal,
    actualizarStockPorCompra,
    
    // Estados del caché
    imagenesProductoCache,
    imagenesProductoCargando,
    
    // Funciones de utilidad
    recargarDatos,
    limpiarDatos,
    manejarErrorAuth
  }

  return (
    <ProductosContext.Provider value={contextValue}>
      {children}
    </ProductosContext.Provider>
  )
}
