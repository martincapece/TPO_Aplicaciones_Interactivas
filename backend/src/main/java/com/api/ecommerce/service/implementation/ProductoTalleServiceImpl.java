package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.ProductoTalle;
import java.util.List;

import com.api.ecommerce.repository.ProductoTalleRepository;
import com.api.ecommerce.service.ProductoTalleService;
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
    public ProductoTalle guardarProductoTalle(ProductoTalle productoTalle) {
        return productoTalleRepository.save(productoTalle);
    }

    @Override
    public void borrarProductoTalle(Long id) {
        productoTalleRepository.deleteById(id);
    }

    @Override
    public List<ProductoTalle> obtenerPorSku(Long sku) {
        return productoTalleRepository.findByProducto_Sku(sku);
    }

    @Override
    public boolean descontarStock(Long sku, Long idTalle, Integer cantidad) {
        ProductoTalle pt = productoTalleRepository.findByProducto_SkuAndTalle_IdTalle(sku, idTalle);
        if (pt == null) return false;
        if (cantidad == null || cantidad <= 0) return false;
        if (pt.getStock() < cantidad) return false;
        pt.setStock(pt.getStock() - cantidad);
        productoTalleRepository.save(pt);
        return true;
    }

    @Override
    public boolean agregarStock(Long sku, Long idTalle, Integer cantidad) {
        ProductoTalle pt = productoTalleRepository.findByProducto_SkuAndTalle_IdTalle(sku, idTalle);
        if (pt == null) return false;
        if (cantidad == null || cantidad <= 0) return false;
        pt.setStock(pt.getStock() + cantidad);
        productoTalleRepository.save(pt);
        return true;
    }

    @Override
    public ProductoTalle getProductoTalle(Long sku, Long idTalle) {
        return productoTalleRepository.findByProducto_SkuAndTalle_IdTalle(sku, idTalle);
    }
}