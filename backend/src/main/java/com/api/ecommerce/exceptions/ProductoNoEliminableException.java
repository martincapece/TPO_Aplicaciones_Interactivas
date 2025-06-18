package com.api.ecommerce.exceptions;

public class ProductoNoEliminableException extends RuntimeException {
    public ProductoNoEliminableException(Long sku) {
        super("No se puede eliminar el producto con SKU: " + sku + " porque no existe");
    }
}