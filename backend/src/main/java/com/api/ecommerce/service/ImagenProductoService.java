package com.api.ecommerce.service;

import com.api.ecommerce.model.ImagenProducto;
import java.util.List;

public interface ImagenProductoService {
    List<ImagenProducto> obtenerPorProducto(Long sku);
    ImagenProducto crearImagen(ImagenProducto img);
    void eliminarImagen(Long id);
}
