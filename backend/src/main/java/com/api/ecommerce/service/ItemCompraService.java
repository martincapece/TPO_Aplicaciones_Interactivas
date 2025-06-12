package com.api.ecommerce.service;

import com.api.ecommerce.model.ItemCompra;
import java.util.List;

public interface ItemCompraService {
    List<ItemCompra> obtenerTodos();
    ItemCompra obtenerItemCompraPorId(Long id);
    ItemCompra guardarItemCompra(ItemCompra itemCompra);
    void borrarItemCompra(Long id);
}
