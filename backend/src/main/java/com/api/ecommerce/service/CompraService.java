package com.api.ecommerce.service;

import com.api.ecommerce.model.Compra;
import java.util.List;

public interface CompraService {
    List<Compra> obtenerTodos();
    Compra obtenerCompraPorId(Long id);
    Compra guardarCompra(Compra compra);
    void borrarCompra(Long id);
}