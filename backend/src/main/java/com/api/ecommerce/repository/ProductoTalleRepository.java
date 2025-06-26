package com.api.ecommerce.repository;

import com.api.ecommerce.model.ProductoTalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoTalleRepository extends JpaRepository<ProductoTalle, Long> {
    List<ProductoTalle> findByProducto_Sku(Long sku);
    Optional<ProductoTalle> findByProducto_SkuAndTalle_Numero(Long sku, String numero);
    ProductoTalle findByProducto_SkuAndTalle_IdTalle(Long sku, Long idTalle);

}