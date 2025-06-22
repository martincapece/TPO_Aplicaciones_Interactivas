import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

export default function ConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title = "¿Estás seguro?", // Título por defecto
    message = "Esta acción no se puede deshacer.", // Mensaje por defecto
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
                        if (typeof onConfirm === 'function') onConfirm();
                    }}
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: 999, px: 4 }}
                >
                    Aceptar
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: 999, px: 4 }}
                >
                    Cancelar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
