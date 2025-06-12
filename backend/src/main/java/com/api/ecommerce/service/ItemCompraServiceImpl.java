package com.api.ecommerce.service;

import com.api.ecommerce.model.ItemCompra;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.repository.ItemCompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemCompraServiceImpl implements ItemCompraService {

    @Autowired
    private ItemCompraRepository itemCompraRepository;

    @Override
    public List<ItemCompra> obtenerTodos() {
        return itemCompraRepository.findAll();
    }

    @Override
    public ItemCompra obtenerItemCompraPorId(Long id) {
        return itemCompraRepository.findById(id).orElse(null);
    }

    @Override
    public ItemCompra guardarItemCompra(ItemCompra itemCompra) {
        return itemCompraRepository.save(itemCompra);
    }

    @Override
    public void borrarItemCompra(Long id) {
        itemCompraRepository.deleteById(id);
    }
}
