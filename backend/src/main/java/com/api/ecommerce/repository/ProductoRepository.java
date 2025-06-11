package com.api.ecommerce.repository;

import com.api.ecommerce.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductoRepository
        extends JpaRepository<Producto, Long>,
        JpaSpecificationExecutor<Producto> {
    // Combinar filtros dinámicamente
}