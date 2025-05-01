import React, { useContext, useState, useEffect } from 'react';
import { IconButton, Badge, TextField } from '@mui/material';
import { Menu as MenuIcon, ArrowBack, Search, Person, ShoppingCart } from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { logoutFirebase } from '../../firebase/providers';
import { AuthContext } from '../../auth/context/AuthContext';
import { CartContext } from '../../Cart/context/CartContext';

export const Navbar = () => {
  const { dispatch } = useContext(AuthContext);
  const {cartSize} = useContext(CartContext)
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const locaton = useLocation();
  const cartItems = cartSize// Cambia esto por el número real de artículos en el carrito
  const { productList } = useContext(CartContext);

  const closeAll = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeAll();
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
    setUserMenuOpen(false);
    setSearchOpen(false);
  };

  const handleUserMenuClick = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchClick = (e) => {
    e.stopPropagation();
    setSearchOpen(!searchOpen);
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = () => {
    console.log('Buscando:', searchText);
    navigate(`/search?query=${searchText}`);
  };

  const handleNavigate = (path) => {
    navigate(path);
    closeAll();
  };

  const isInicio = location.pathname === '/' || location.pathname === '/inicio';

  return (
    <div className="navbar" onClick={(e) => e.stopPropagation()}>
      <IconButton onClick={(e) => (isInicio ? handleMenuClick(e) : navigate(-1))}>
        {isInicio ? <MenuIcon /> : <ArrowBack />}
      </IconButton>

      {menuOpen && isInicio && (
        <div className="navbar-menu" onClick={(e) => e.stopPropagation()}>
          <ul>
            <li onClick={() => handleNavigate('/contacto')}>Contacto</li>
            <li onClick={() => handleNavigate('/nosotros')}>Nosotros</li>
            <li onClick={() => handleNavigate('/productos')}>Productos</li>
          </ul>
        </div>
      )}

      <div className="navbar-search-container">
        <IconButton onClick={handleSearchClick}>
          <Search />
        </IconButton>
        {searchOpen && (
          <TextField
            variant="outlined"
            size="small"
            placeholder="Buscar..."
            value={searchText}
            onChange={handleSearchChange}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="search-bar"
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>

      <div className="navbar-logo" onClick={() => navigate('/')}>
        <img src="/assets/logo_ecomerce.jpg" alt="Logo" />
      </div>

      <div className="navbar-user-menu-container">
        <IconButton onClick={handleUserMenuClick}>
          <Person />
        </IconButton>
        {userMenuOpen && (
          <div className="navbar-user-menu" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={() => handleNavigate('/cuenta')}>Cuenta</li>
              <li onClick={() => handleNavigate('/metodos-pago')}>Métodos de pago</li>
              <li onClick={() => logoutFirebase(dispatch)}>Cerrar sesión</li>
            </ul>
          </div>
        )}
      </div>

      <IconButton LinkComponent={Link} to="/inicio/cart" onClick={() => navigate('/cart')}>
        <Badge badgeContent={cartItems} color="error">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </div>
  );
};

