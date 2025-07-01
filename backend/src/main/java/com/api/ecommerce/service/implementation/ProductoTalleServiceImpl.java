package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.ProductoTalle;
import java.util.List;

import com.api.ecommerce.repository.ProductoRepository;
import com.api.ecommerce.repository.ProductoTalleRepository;
import com.api.ecommerce.repository.TalleRepository;
import com.api.ecommerce.service.ProductoTalleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoTalleServiceImpl implements ProductoTalleService {

    @Autowired
    private ProductoTalleRepository productoTalleRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private TalleRepository talleRepository;

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

    @Override
    public ProductoTalle actualizarStock(Long sku, Long idTalle, Integer cantidad) {
        ProductoTalle pt = productoTalleRepository.findByProducto_SkuAndTalle_IdTalle(sku, idTalle);
        if (pt == null) {
            pt = new ProductoTalle();
            pt.setStock(cantidad);
            // Debes setear el producto y el talle correctamente:
            // Suponiendo que tienes métodos para obtenerlos:
            pt.setProducto(productoRepository.findById(sku).orElse(null));
            pt.setTalle(talleRepository.findById(idTalle).orElse(null));
        } else {
            pt.setStock(cantidad);
        }
        return productoTalleRepository.save(pt);
    }
}