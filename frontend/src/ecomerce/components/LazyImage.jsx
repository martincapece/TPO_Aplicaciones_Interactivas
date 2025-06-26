import React, { useState, useEffect, useCallback } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';

export const LazyImage = React.memo(({ src, alt, onClick, showSkeleton = true, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const imgNotFound = "/assets/imgNotFound.jpg";
    const [currentSrc, setCurrentSrc] = useState(src || imgNotFound);

    useEffect(() => {
        const newSrc = src || imgNotFound;
        if (newSrc !== currentSrc) {
            setCurrentSrc(newSrc);
            setLoaded(false);
            setError(false);
        }
    }, [src, currentSrc, imgNotFound]);

    const handleImageLoad = useCallback(() => {
        setLoaded(true);
        setError(false);
    }, []);

    const handleImageError = useCallback(() => {
        if (src && currentSrc !== imgNotFound) {
            setCurrentSrc(imgNotFound);
            setLoaded(false);
            setError(false);
        } else {
            setError(true);
            setLoaded(true);
        }
    }, [src, currentSrc, imgNotFound]);

    const handleClick = useCallback((e) => {
        e.preventDefault();
        if (onClick && !error) onClick(e);
    }, [onClick, error]);

    return (
        <Box sx={{ position: 'relative', ...props.sx }} onClick={handleClick}>
            {showSkeleton && !loaded && !error && (
                <Skeleton
                    variant="rectangular"
                    width="100%"
                    height="100%"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 1,
                        borderRadius: props.sx?.borderRadius || 0
                    }}
                />
            )}
            
            <Box
                component="img"
                src={currentSrc}
                alt={alt}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
                sx={{
                    ...props.sx,
                    opacity: loaded ? 1 : 0,
                    transition: loaded ? 'opacity 0.3s ease-in-out' : 'none',
                    position: 'relative',
                    zIndex: loaded ? 2 : 0,
                    display: 'block'
                }}
            />
            
            {error && currentSrc === imgNotFound && (
                <Box
                    sx={{
                        ...props.sx,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f5f5f5',
                        color: '#999',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 3,
                        fontSize: '12px'
                    }}
                >
                    <Typography variant="caption">Error de carga</Typography>
                </Box>
            )}
        </Box>
    );
});