package com.api.ecommerce.service;

import com.api.ecommerce.model.ImagenProducto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ImagenProductoService {
    List<ImagenProducto> obtenerTodos();
    List<ImagenProducto> obtenerImagenPorIdProducto(Long sku);
    ImagenProducto guardarImagen(ImagenProducto img);
    void borrarImagen(Long id);
    void deleteByProductoSku(Long sku);
}
