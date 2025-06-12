package com.api.ecommerce.service;

import com.api.ecommerce.model.Producto;
import java.math.BigDecimal;
import java.util.List;

public interface ProductoService {
    List<Producto> obtenerTodos();
    Producto obtenerProductoPorSku(Long sku);
    Producto guardarProducto(Producto p);
    void borrarProducto(Long sku);

    /** Filtrado dinámico combinado */
    List<Producto> filtrarProducto(
            String marca,
            String modelo,
            String color,
            BigDecimal minPrecio,
            BigDecimal maxPrecio,
            Boolean destacados,
            Boolean nuevos
    );
}
