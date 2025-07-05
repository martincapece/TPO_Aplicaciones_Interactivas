import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, CircularProgress } from '@mui/material';

export default function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title = "¿Estás seguro?", // Título por defecto
    message = "Esta acción no se puede deshacer.", // Mensaje por defecto
    isLoading = false, // ✅ Nuevo prop para estado de carga
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{
                sx: {
                    borderRadius: 4,
                    backgroundColor: 'white',
                    textAlign: 'center',
                    p: 3,
                },
            }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
            }}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button
                    onClick={() => {
                        if (typeof onConfirm === 'function' && !isLoading) onConfirm();
                    }}
                    variant="contained"
                    color="primary"
                    disabled={isLoading} // ✅ Deshabilitar cuando está cargando
                    sx={{ borderRadius: 999, px: 4 }}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {isLoading ? 'Procesando...' : 'Aceptar'}
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    disabled={isLoading} // ✅ Deshabilitar cancelar cuando está cargando
                    sx={{ borderRadius: 999, px: 4 }}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
