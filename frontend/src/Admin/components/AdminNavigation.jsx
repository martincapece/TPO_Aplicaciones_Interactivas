import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AdminNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentTab = () => {
    if (location.pathname.includes('/admin/compras')) {
      return 1;
    }
    return 0; // Dashboard de productos por defecto
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate('/admin');
    } else if (newValue === 1) {
      navigate('/admin/compras');
    }
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
      <Tabs 
        value={getCurrentTab()} 
        onChange={handleTabChange}
        aria-label="admin navigation tabs"
      >
        <Tab label="Productos" />
        <Tab label="Historial de Compras" />
      </Tabs>
    </Box>
  );
} 