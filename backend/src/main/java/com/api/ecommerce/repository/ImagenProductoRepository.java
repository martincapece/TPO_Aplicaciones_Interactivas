package com.api.ecommerce.repository;

import com.api.ecommerce.model.ImagenProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImagenProductoRepository extends JpaRepository<ImagenProducto, Long> {
    
    List<ImagenProducto> findBySkuProductoOrderByOrdenVisualizacionAsc(Long skuProducto);
    
    List<ImagenProducto> findBySkuProductoAndEsPrincipalTrue(Long skuProducto);
    
    long countBySkuProductoAndEsPrincipalTrue(Long skuProducto);
    
    @Query("SELECT MAX(i.ordenVisualizacion) FROM ImagenProducto i WHERE i.skuProducto = :skuProducto")
    Optional<Integer> findMaxOrdenBySkuProducto(@Param("skuProducto") Long skuProducto);
    
    void deleteBySkuProducto(Long skuProducto);
    
    @Query("SELECT i FROM ImagenProducto i WHERE i.skuProducto = :skuProducto AND i.esPrincipal = true")
    Optional<ImagenProducto> findImagenPrincipalBySkuProducto(@Param("skuProducto") Long skuProducto);
}