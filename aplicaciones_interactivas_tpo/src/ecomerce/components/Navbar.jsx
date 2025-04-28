import React, { useContext, useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import { Menu as MenuIcon, ArrowBack, Search, Person, ShoppingCart } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logoutFirebase } from '../../firebase/providers';
import { AuthContext } from '../../auth/context/AuthContext';

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = 3; // Cambia esto por el número real de artículos en el carrito
  const { dispatch } = useContext(AuthContext);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const isInicio = location.pathname === '/' || location.pathname === '/inicio';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px', position: 'relative' }}>
      {/* Condicional para mostrar el ícono */}
      <IconButton onClick={() => (isInicio ? handleMenuClick() : navigate(-1))}>
        {isInicio ? <MenuIcon /> : <ArrowBack />}
      </IconButton>

      {/* Menú desplegable */}
      {menuOpen && isInicio && (
        <div
          style={{
            position: 'fixed',
            top: '50px',
            left: '0',
            width: '100%',
            background: '#fff',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            zIndex: 10,
          }}
        >
          <ul style={{ listStyle: 'none', margin: 0, padding: '10px' }}>
            <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => handleNavigate('/contacto')}>
              Contacto
            </li>
            <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => handleNavigate('/nosotros')}>
              Nosotros
            </li>
            <li style={{ padding: '5px 0', cursor: 'pointer' }} onClick={() => handleNavigate('/productos')}>
              Productos
            </li>
          </ul>
        </div>
      )}

      <IconButton onClick={() => navigate('/search')}>
        <Search />
      </IconButton>

      <div style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate('/')}>
        <img src="/assets/logo_ecomerce.jpg" style={{ width: 50 }} alt="" />
      </div>

      <IconButton onClick={() => logoutFirebase( dispatch ) }>
        <Person />
      </IconButton>
      <IconButton onClick={() => navigate('/cart')}>
        <Badge badgeContent={cartItems} color="error">
          <ShoppingCart />
        </Badge>
      </IconButton>
    </div>
  );
};

