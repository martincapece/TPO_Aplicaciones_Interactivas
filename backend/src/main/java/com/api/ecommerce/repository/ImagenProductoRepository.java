package com.api.ecommerce.repository;

import com.api.ecommerce.model.ImagenProducto;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {

    List<ImagenProducto> findByProductoSkuOrderByOrdenVisualizacionAsc(Long sku);

    List<ImagenProducto> findByProductoSkuAndEsPrincipalTrue(Long sku);

    long countByProductoSkuAndEsPrincipalTrue(Long sku);

    @Query("SELECT MAX(i.ordenVisualizacion) " +
            "FROM ImagenProducto i WHERE i.producto.sku = :sku")
    Optional<Integer> findMaxOrdenByProductoSku(@Param("sku") Long sku);

    void deleteByProductoSku(Long sku);

    @Query("SELECT i FROM ImagenProducto i " +
            "WHERE i.producto.sku = :sku AND i.esPrincipal = true")
    Optional<ImagenProducto> findImagenPrincipalByProductoSku(@Param("sku") Long sku);
}