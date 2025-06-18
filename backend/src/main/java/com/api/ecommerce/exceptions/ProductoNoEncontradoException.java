package com.api.ecommerce.exceptions;

public class ProductoNoEncontradoException extends RuntimeException {
    public ProductoNoEncontradoException(Long sku) {
        super("Producto no encontrado con SKU: " + sku);
    }
}

