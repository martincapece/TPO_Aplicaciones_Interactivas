package com.api.ecommerce.service;

import com.api.ecommerce.model.ProductoTalle;
import java.util.List;

public interface ProductoTalleService {
    List<ProductoTalle> obtenerTodos();
    ProductoTalle obtenerProductoTallePorId(Long id);
    ProductoTalle guardarProductoTalle(ProductoTalle productoTalle);
    void borrarProductoTalle(Long id);
}
