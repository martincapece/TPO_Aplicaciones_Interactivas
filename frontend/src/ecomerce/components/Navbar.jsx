import { useContext, useState, useEffect } from 'react';
import { IconButton, Badge, TextField, useTheme, useMediaQuery, Box, Menu, MenuItem, Typography, Grid } from '@mui/material';
import { Menu as MenuIcon, Search, Person, ShoppingCart } from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { logoutFirebase } from '../../firebase/providers';
import { AuthContext } from '../../auth/context/AuthContext';
import { CartContext } from '../../Cart/context/CartContext';

export const Navbar = () => {
  const { cartSize } = useContext(CartContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]); // Estado para los productos filtrados
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const cartItems = cartSize; // Cambia esto por el número real de artículos en el carrito
  const { dispatch, authState } = useContext(AuthContext);
  const { user } = authState;
  const [productos, setProductos] = useState([]);
  const { resetCart } = useContext(CartContext);

  useEffect(() => {
    fetch("http://localhost:3000/data")
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(err => console.error("Error al cargar productos", err));
  }, []);


  const handleNavigate = (path) => {
    navigate(path);
    handleCloseMenus();
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault(); // PREVIENE recarga o pérdida de navegación
    if (searchText.trim()) {
      navigate(`/productos?query=${encodeURIComponent(searchText.trim())}`);
      setSearchOpen(false);
      setFilteredProducts([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    // Filtrar productos que coincidan con el texto ingresado
    if (value.trim()) {
      const lowerValue = value.toLowerCase();
      const results = productos.filter(
        sneaker =>
          sneaker.model.toLowerCase().includes(lowerValue) ||
          sneaker.brand.toLowerCase().includes(lowerValue)
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  };

  const handleOpenMenu = (e) => {
    setMenuAnchorEl(e.currentTarget);
    setUserAnchorEl(null);
    setSearchOpen(false);
  };

  const handleOpenUserMenu = (e) => {
    setUserAnchorEl(e.currentTarget);
    setMenuAnchorEl(null);
    setSearchOpen(false);
  };

  const handleCloseMenus = () => {
    setMenuAnchorEl(null);
    setUserAnchorEl(null);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => handleCloseMenus();
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
      <Grid  size={{ md: 2, lg: 3 }} display={(isMobile) ? 'none' : ''} >
        <img src="/assets/logo_ecomerce.png" alt="Logo"  onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} style={{ width: 100  }} />
      </Grid>

      {/* Menu (responsive) */}
      {isMobile ? (
        <>
          <Grid size={{ sm: 2 }}>
            <IconButton onClick={handleOpenMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleCloseMenus}
            >
              <MenuItem onClick={() => handleNavigate('/catalogo#productos')}>Productos</MenuItem>
              <MenuItem onClick={() => handleNavigate('/inicio#destacados')}>Destacados</MenuItem>
              <MenuItem onClick={() => handleNavigate('/nosotros#sobre')}>Sobre Nosotros</MenuItem>
              <MenuItem onClick={() => handleNavigate('/nosotros#contacto')}>Contacto</MenuItem>
            </Menu>
          </Grid>

          <Grid 
          onClick={() => navigate('/')} 
          size={{ sm: 2 }}
          sx={{ 
            cursor: 'pointer', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          >
            <Grid
            component="img"
            src="/assets/logo_ecomerce.png"
            alt="Logo"
            sx={{ width: { xs: 60, sm: 80, } }} // ancho responsivo
            />
          </Grid>
        </>
      ) : (
        <Grid container spacing={ 3 } size={{ md: 6, lg: 5 }} justifyContent={'center'} >
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate('/catalogo#productos')}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            >
              Productos
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate('/inicio#destacados')}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            >
              Destacados
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate('/nosotros#sobre')}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
            >
              Sobre Nosotros
            </Typography>
          </Grid>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate('/nosotros#contacto')}
              sx={{ cursor: 'pointer', fontWeight: 500 }}
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'end'
      }}
      >
        {/* Search */}
        <Box display="flex" alignItems="center" position="relative" size='small'>
          <IconButton onClick={(e) => {
            e.stopPropagation();
            setSearchOpen(!searchOpen);
            setMenuAnchorEl(null);
            setUserAnchorEl(null);
          }}>
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
                sx={{ ml: 1, width: { xs: 55, sm: 100, lg: 150} }}
                onClick={(e) => e.stopPropagation()}
              />
            </form>
          )}
          {searchOpen && filteredProducts.length > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: '40px',
                left: 0,
                width: '100%',
                maxHeight: '200px',
                overflowY: 'auto',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
              }}
            >
              {filteredProducts.map((product) => (
                <Box
                  key={product.id}
                  display="flex"
                  alignItems="center"
                  p={1}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' },
                  }}
                  onClick={() => {
                    navigate(`/producto/${product.id}`);
                    setSearchOpen(false);
                    setFilteredProducts([]);
                  }}
                >
                  <Grid
                  container
                  direction={{ xs: 'column', sm: 'row' }} // Stack en mobile, horizontal en desktop
                  alignItems="center"
                  borderBottom={1}
                  borderColor="divider"
                  >
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Box
                        component="img"
                        src={product.image[0]} // Usa la primera imagen del producto
                        alt={product.model}
                        sx={{ width: 40, height: 40, borderRadius: 1, mr: 2 }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }} sx={{ mb: 1}}>
                      <Typography variant="body2">{product.model}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
          
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton onClick={handleOpenUserMenu} size='small'>
            <Person />
          </IconButton>
          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleCloseMenus}
          >
            <Typography variant='p' sx={{ fontFamily: 'Inter', fontWeight: '600', px: 1 }}>{ user?.email || 'user' }</Typography>
            {
              user?.role === 'admin' && (
                <MenuItem variant="p" onClick={() => handleNavigate('/admin')} sx={{ cursor: 'pointer', fontWeight: 500 }}>Dashboard</MenuItem>
              )
            }
            <MenuItem onClick={() => logoutFirebase(dispatch)}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>

        {/* Cart */}
        <IconButton component={Link} to="/inicio/cart" size='small' onClick={() => navigate('/cart')}>
          <Badge badgeContent={cartItems} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Grid>
    </Grid>
  );
};
