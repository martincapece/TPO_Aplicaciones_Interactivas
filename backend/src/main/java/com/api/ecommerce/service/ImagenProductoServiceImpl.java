package com.api.ecommerce.service;

import com.api.ecommerce.model.ImagenProducto;
import com.api.ecommerce.repository.ImagenProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ImagenProductoServiceImpl implements ImagenProductoService {

    private final ImagenProductoRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<ImagenProducto> obtenerPorProducto(String sku) {
        return repo.findByProductoSkuOrderByOrden(sku);
    }

    @Override
    @Transactional
    public ImagenProducto crearImagen(ImagenProducto img) {
        return repo.save(img);
    }

    @Override
    @Transactional
    public void eliminarImagen(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("No existe imagen con ID " + id);
        }
        repo.deleteById(id);
    }
}