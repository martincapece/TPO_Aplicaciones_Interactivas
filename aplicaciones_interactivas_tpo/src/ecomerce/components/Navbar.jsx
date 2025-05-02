import React, { useContext, useState, useEffect } from 'react';
import { IconButton, Badge, TextField, useTheme, useMediaQuery, Box, Stack, Menu, MenuItem, Typography, Grid } from '@mui/material';
import { Menu as MenuIcon, ArrowBack, Search, Person, ShoppingCart } from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutFirebase } from '../../firebase/providers';
import { AuthContext } from '../../auth/context/AuthContext';
import { CartContext } from '../../Cart/context/CartContext';

export const Navbar = () => {
  const { productList, cartSize } = useContext(CartContext);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [userAnchorEl, setUserAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const cartItems = cartSize// Cambia esto por el número real de artículos en el carrito
  const { dispatch, authState } = useContext(AuthContext);
  const { user } = authState;

  const isInicio = location.pathname === '/' || location.pathname === '/inicio';

  const handleNavigate = (path) => {
    navigate(path);
    handleCloseMenus();
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigate(`/search?query=${searchText}`);
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
      <Grid onClick={() => navigate('/')} size={{ md: 3, lg: 4.5 }} display={(isMobile) ? 'none' : ''} sx={{ cursor: 'pointer' }}>
        <img src="/assets/logo_ecomerce.jpg" alt="Logo" style={{ width: 50 }} />
      </Grid>

      {/* Menu (responsive) */}
      {isMobile ? (
        <>
          <Grid size={ 4.5 }>
            <IconButton onClick={handleOpenMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleCloseMenus}
            >
              <MenuItem onClick={() => handleNavigate('/catalogo')}>Productos</MenuItem>
              <MenuItem onClick={() => handleNavigate('/inicio#destacados')}>Destacados</MenuItem>
              <MenuItem onClick={() => handleNavigate('/nosotros#sobre')}>Sobre Nosotros</MenuItem>
              <MenuItem onClick={() => handleNavigate('/nosotros#contacto')}>Contacto</MenuItem>
            </Menu>
          </Grid>

          <Grid onClick={() => navigate('/')} size={ 1 } sx={{ cursor: 'pointer' }}>
            <img src="/assets/logo_ecomerce.jpg" alt="Logo" style={{ width: 50 }} />
          </Grid>
        </>
      ) : (
        <Grid container spacing={3} size={{ md: 6, lg: 4.5 }}>
          <Grid>
            <Typography
              variant="body1"
              onClick={() => handleNavigate('/catalogo')}
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

      <Grid container alignItems="center" justifyContent="flex-end" size={ 3 } sx={{ flexGrow: 1 }}>
        {/* Search */}
        <Box display="flex" alignItems="center">
          <IconButton onClick={(e) => {
            e.stopPropagation();
            setSearchOpen(!searchOpen);
            setMenuAnchorEl(null);
            setUserAnchorEl(null);
          }}>
            <Search />
          </IconButton>
          {searchOpen && (
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
              sx={{ ml: 1, width: 200 }}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton onClick={handleOpenUserMenu}>
            <Person />
          </IconButton>
          <Menu
            anchorEl={userAnchorEl}
            open={Boolean(userAnchorEl)}
            onClose={handleCloseMenus}
          >
            <Typography variant='p' sx={{ fontFamily: 'Inter', fontWeight: '600', px: 1 }}>{ user?.email || 'user' }</Typography>
            <MenuItem onClick={() => handleNavigate('/metodos-pago')}>Métodos de pago</MenuItem>
            <MenuItem onClick={() => logoutFirebase(dispatch)}>Cerrar sesión</MenuItem>
          </Menu>
        </Box>

        {/* Cart */}
        <IconButton component={Link} to="/inicio/cart" onClick={() => navigate('/cart')}>
          <Badge badgeContent={cartItems} color="error">
            <ShoppingCart />
          </Badge>
        </IconButton>
      </Grid>
    </Grid>
  );
};
