package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.ImagenProducto;
import com.api.ecommerce.repository.ImagenProductoRepository;
import com.api.ecommerce.service.ImagenProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImagenProductoServiceImpl implements ImagenProductoService {

    private final ImagenProductoRepository imagenProductoRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ImagenProducto> obtenerTodos() {
        return imagenProductoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImagenProducto> obtenerImagenPorIdProducto(Long sku) {
        return imagenProductoRepository.findByProductoSkuOrderByOrden(sku);
    }

    @Transactional
    @Override
    public void deleteByProductoSku(Long sku) {
        imagenProductoRepository.deleteByProductoSku(sku);
    }

    @Override
    @Transactional
    public ImagenProducto guardarImagen(ImagenProducto img) {
        return imagenProductoRepository.save(img);
    }

    @Override
    @Transactional
    public void borrarImagen(Long id) {
        if (!imagenProductoRepository.existsById(id)) {
            throw new IllegalArgumentException("No existe imagen con ID " + id);
        }
        imagenProductoRepository.deleteById(id);
    }
}