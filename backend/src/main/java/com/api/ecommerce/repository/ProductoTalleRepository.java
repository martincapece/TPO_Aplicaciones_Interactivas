package com.api.ecommerce.repository;

import com.api.ecommerce.model.ProductoTalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoTalleRepository extends JpaRepository<ProductoTalle, Long> {
    List<ProductoTalle> findByProducto_Sku(Long sku);
}