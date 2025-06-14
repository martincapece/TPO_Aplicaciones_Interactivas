package com.api.ecommerce.service;

import com.api.ecommerce.model.ProductoTalle;
import java.util.List;

public interface ProductoTalleService {
    List<ProductoTalle> obtenerTodos();
    ProductoTalle guardarProductoTalle(ProductoTalle productoTalle);
    void borrarProductoTalle(Long id);
    List<ProductoTalle> obtenerPorSku(Long sku);

}
