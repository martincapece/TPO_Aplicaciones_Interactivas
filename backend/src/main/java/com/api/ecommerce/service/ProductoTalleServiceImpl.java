package com.api.ecommerce.service;

import com.api.ecommerce.model.ProductoTalle;
import java.util.List;

import com.api.ecommerce.repository.ProductoTalleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoTalleServiceImpl implements ProductoTalleService {

    @Autowired
    private ProductoTalleRepository productoTalleRepository;

    @Override
    public List<ProductoTalle> obtenerTodos() {
        return productoTalleRepository.findAll();
    }

    @Override
    public ProductoTalle obtenerProductoTallePorId(Long id) {
        return productoTalleRepository.findById(id).orElse(null);
    }

    @Override
    public ProductoTalle guardarProductoTalle(ProductoTalle productoTalle) {
        return productoTalleRepository.save(productoTalle);
    }

    @Override
    public void borrarProductoTalle(Long id) {
        productoTalleRepository.deleteById(id);
    }
}
