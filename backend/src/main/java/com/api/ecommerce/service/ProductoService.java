package com.api.ecommerce.service;

import com.api.ecommerce.model.Producto;
import java.math.BigDecimal;
import java.util.List;

public interface ProductoService {
    List<Producto> obtenerTodos();
    Producto obtenerPorSku(String sku);
    Producto crearProducto(Producto p);
    void eliminarProducto(String sku);

    /** Filtrado dinámico combinado */
    List<Producto> filtrar(
            String marca,
            String modelo,
            String color,
            BigDecimal minPrecio,
            BigDecimal maxPrecio,
            Boolean destacados,
            Boolean nuevos
    );
}
