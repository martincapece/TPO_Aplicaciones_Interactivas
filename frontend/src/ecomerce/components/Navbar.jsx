import { useContext, useState, useEffect } from "react"
import {
  IconButton,
  Badge,
  TextField,
  useTheme,
  useMediaQuery,
  Box,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Paper,
  Avatar,
  Divider,
} from "@mui/material"
import { Menu as MenuIcon, Search, Person, ShoppingCart } from "@mui/icons-material"
import { useNavigate, Link } from "react-router-dom"
import { logoutFirebase } from "../../firebase/providers"
import { AuthContext } from "../../auth/context/AuthContext"
import { CartContext } from "../../Cart/context/CartContext"
import { ProductosContext } from "../context/ProductosContext.jsx"

export const Navbar = () => {
  const { cartSize } = useContext(CartContext)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const cartItems = cartSize
  const { dispatch, authState } = useContext(AuthContext)
  const { user } = authState

  // CONSTANTE: imagen not found
  const imgNotFound = "/assets/imgNotFound.jpg";

  // Usar ProductosContext
  const {
    productos,
    loading: loadingProductos,
    getImagenPrincipalPorSku,
    getEstadoImagenPorSku,
    datosYaCargados
  } = useContext(ProductosContext)

  const handleLogoClick = () => {
    navigate("/", { replace: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (path) => {
    navigate(path)
    handleCloseMenus()
  }

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault()
    if (searchText.trim()) {
      navigate(`/productos?query=${encodeURIComponent(searchText.trim())}`)
      setSearchOpen(false)
      setFilteredProducts([])
    }
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchText(value)

    if (value.trim() && datosYaCargados) {
      const lowerValue = value.toLowerCase()
      const results = productos.filter(
        (sneaker) =>
          sneaker.modelo.toLowerCase().includes(lowerValue) || 
          sneaker.marca.toLowerCase().includes(lowerValue),
      ).slice(0, 8)
      setFilteredProducts(results)
    } else {
      setFilteredProducts([])
    }
  }

  const handleOpenMenu = (e) => {
    setMenuAnchorEl(e.currentTarget)
    setUserAnchorEl(null)
    setSearchOpen(false)
  }

  const handleOpenUserMenu = (e) => {
    setUserAnchorEl(e.currentTarget)
    setMenuAnchorEl(null)
    setSearchOpen(false)
  }

  const handleCloseMenus = () => {
    setMenuAnchorEl(null)
    setUserAnchorEl(null)
    setSearchOpen(false)
  }

  // Función para obtener imagen del producto
  const getImagenProducto = (sku) => {
    const imagenPrincipal = getImagenPrincipalPorSku(sku)
    const estadoImagen = getEstadoImagenPorSku(sku)
    
    if (estadoImagen === 'cargada' && imagenPrincipal?.cloudinarySecureUrl) {
      return imagenPrincipal.cloudinarySecureUrl
    }
    
    return imgNotFound
  }

  useEffect(() => {
    const handleClickOutside = () => handleCloseMenus()
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <Grid
      container
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      py={1}
      boxShadow={2}
      position="sticky"
      top={0}
      bgcolor="white"
      zIndex={1000}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Logo */}
      <Grid size={{ md: 2, lg: 3 }} display={isMobile ? "none" : ""}>
        <img
          src="/assets/logo_ecomerce.png"
          alt="Logo"
          onClick={handleLogoClick}
          style={{ cursor: "pointer", width: 100 }}
        />
      </Grid>

      {/* Menu (responsive) */}
      {isMobile ? (
        <>
          <Grid size={{ sm: 2 }}>
            <IconButton onClick={handleOpenMenu}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleCloseMenus}>
              <MenuItem onClick={() => handleNavigate("/catalogo#productos")}>Productos</MenuItem>
              <MenuItem onClick={() => handleNavigate("/inicio#destacados")}>Destacados</MenuItem>
              <MenuItem onClick={() => handleNavigate("/nosotros#sobre")}>Sobre Nosotros</MenuItem>
              <MenuItem onClick={() => handleNavigate("/nosotros#contacto")}>Contacto</MenuItem>
            </Menu>
          </Grid>

          <Grid
            onClick={() => navigate("/")}
            size={{ sm: 2 }}
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Grid 
              component="img" 
              src="/assets/logo_ecomerce.png" 
              alt="Logo" 
              sx={{ cursor: "pointer", width: { xs: 60, sm: 80 } }} 
            />
          </Grid>
        </>
      ) : (
        <Grid container spacing={3} size={{ md: 6, lg: 5 }} justifyContent={"center"}>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate("/catalogo#productos")}
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              Productos
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate("/inicio#destacados")}
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              Destacados
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate("/nosotros#sobre")}
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              Sobre Nosotros
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate("/nosotros#contacto")}
              sx={{ cursor: "pointer", fontWeight: 500 }}
            >
              Contacto
            </Typography>
          </Grid>
        </Grid>
      )}

      <Grid
        container
        size={{ xs: searchOpen ? 6 : 4, sm: searchOpen ? 4 : 3 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
        }}
      >
        {/* Search */}
        <Box display="flex" alignItems="center" position="relative" size="small">
          <IconButton
            onClick={(e) => {
              e.stopPropagation()
              setSearchOpen(!searchOpen)
              setMenuAnchorEl(null)
              setUserAnchorEl(null)
            }}
          >
            <Search />
          </IconButton>
          {searchOpen && (
            <form onSubmit={handleSearchSubmit}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Buscar..."
                value={searchText}
                onChange={handleSearchChange}
                sx={{ ml: 1, width: { xs: 55, sm: 100, lg: 150 } }}
                onClick={(e) => e.stopPropagation()}
                disabled={!datosYaCargados}
              />
            </form>
          )}
          {searchOpen && filteredProducts.length > 0 && datosYaCargados && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: "40px",
                left: 0,
                width: "120%",
                maxHeight: "200px",
                overflowY: "auto",
                backgroundColor: "white",
                zIndex: 1000,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {filteredProducts.map((product, index) => (
                <Box key={product.sku}>
                  <Box
                    sx={{
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      "&:hover": { backgroundColor: "#f5f5f5" },
                    }}
                    onClick={() => {
                      navigate(`/producto/${product.sku}`)
                      setSearchOpen(false)
                      setFilteredProducts([])
                      setSearchText("")
                    }}
                  >
                    <Grid container direction={{ xs: "column", sm: "row" }} alignItems="center" sx={{ p: 1 }}>
                      <Grid size={{ xs: 12, sm: 6, lg: 5 }} sx={{ display: "flex", justifyContent: { xs: "center", sm: "left" } }}>
                        <Avatar
                          src={getImagenProducto(product.sku)}
                          alt={product.modelo}
                          variant="rounded"
                          sx={{
                            width: 70,
                            height: 50,
                            flexShrink: 0,
                          }}
                        />
                      </Grid>
                      <Grid
                        size={{ xs: 12, sm: 6, lg: 6 }}
                        sx={{ mb: { xs: 1, sm: 0 }, textAlign: { xs: "center", sm: "left" } }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {product.modelo}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            display: "block",
                          }}
                        >
                          {product.marca}
                        </Typography>
                        {product.precio && (
                          <Typography
                            variant="body2"
                            color="primary"
                            fontWeight={600}
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            ${product.precio.toLocaleString()}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Box>

                  {index < filteredProducts.length - 1 && <Divider variant="middle" />}
                </Box>
              ))}
            </Paper>
          )}
          
          {searchOpen && searchText.trim() && !datosYaCargados && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: "40px",
                left: 0,
                width: "120%",
                backgroundColor: "white",
                zIndex: 1000,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Cargando productos...
              </Typography>
            </Paper>
          )}
          
          {searchOpen && searchText.trim() && datosYaCargados && filteredProducts.length === 0 && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: "40px",
                left: 0,
                width: "120%",
                backgroundColor: "white",
                zIndex: 1000,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                p: 2
              }}
            >
              <Typography variant="body2" color="text.secondary" textAlign="center">
                No se encontraron productos
              </Typography>
            </Paper>
          )}
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton onClick={handleOpenUserMenu} size="small">
            <Person />
          </IconButton>
          <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleCloseMenus}>
            <Typography variant="p" sx={{ fontFamily: "Inter", fontWeight: "600", px: 1 }}>
              {user?.mail}
            </Typography>
            {user?.rol === "ADMIN" && (
              <MenuItem
                variant="p"
                onClick={() => handleNavigate("/admin")}
                sx={{ cursor: "pointer", fontWeight: 500 }}
              >
                Dashboard
              </MenuItem>
            )}
            <MenuItem onClick={() => logoutFirebase(dispatch)}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>

        {/* Cart */}
        <IconButton component={Link} to="/inicio/cart" size="small" onClick={() => navigate("/cart")}>
          <Badge badgeContent={cartItems} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Grid>
    </Grid>
  )
}
