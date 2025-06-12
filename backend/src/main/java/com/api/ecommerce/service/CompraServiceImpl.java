package com.api.ecommerce.service;

import com.api.ecommerce.model.Compra;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.repository.CompraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CompraServiceImpl implements CompraService {

    @Autowired
    private CompraRepository compraRepository;

    @Override
    public List<Compra> obtenerTodos() {
        return compraRepository.findAll();
    }

    @Override
    public Compra obtenerCompraPorId(Long id) {
        return compraRepository.findById(id).orElse(null);
    }

    @Override
    public Compra guardarCompra(Compra compra) {
        return compraRepository.save(compra);
    }

    @Override
    public void borrarCompra(Long id) {
        compraRepository.deleteById(id);
    }
}
