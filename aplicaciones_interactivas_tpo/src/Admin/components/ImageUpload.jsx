import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function ImageUpload({
    mainImage,
    extraImages,
    handleImageUpload,
    handleImageRemove,
    handleExtraImageUpload,
    handleExtraImageRemove
}) {
    return (
        <Box>
            {/* Imagen principal */}
            <Box
                sx={{
                    width: '300px',
                    height: '300px',
                    borderRadius: 2,
                    border: '1px solid #ccc',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5',
                    position: 'relative',
                }}
            >
                {mainImage ? (
                    <>
                        <Box
                            component="img"
                            src={mainImage}
                            alt="Vista previa"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                            }}
                        />
                        <Button
                            size="small"
                            onClick={handleImageRemove}
                            sx={{
                                minWidth: 0,
                                padding: '2px',
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: '#fff',
                                borderRadius: '50%',
                                fontSize: '10px',
                                fontWeight: 'bold',
                            }}
                        >
                            ✕
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 2 }}>
                            Subir Imagen
                        </Typography>
                        <Button variant="outlined" component="label">
                            Seleccionar archivo
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                hidden
                            />
                        </Button>
                    </>
                )}
            </Box>

            {/* Imágenes adicionales */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {[0, 1, 2].map((index) => (
                    <Box
                        key={index}
                        sx={{
                            width: 90,
                            height: 90,
                            borderRadius: 2,
                            border: '1px dashed #aaa',
                            position: 'relative',
                            backgroundColor: '#fafafa',
                            overflow: 'hidden',
                        }}
                    >
                        {extraImages[index] ? (
                            <>
                                <Box
                                    component="img"
                                    src={extraImages[index]}
                                    alt={`extra-${index}`}
                                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <Button
                                    size="small"
                                    onClick={() => handleExtraImageRemove(index)}
                                    sx={{
                                        minWidth: 0,
                                        padding: '2px',
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        backgroundColor: '#fff',
                                        borderRadius: '50%',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                    }}
                                >
                                    ✕
                                </Button>
                            </>
                        ) : (
                            <Button
                                component="label"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: '10px',
                                    px: 1,
                                    textTransform: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                Añadir
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleExtraImageUpload(e, index)}
                                />
                            </Button>
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
