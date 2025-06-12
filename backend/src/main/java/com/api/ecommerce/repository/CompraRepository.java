package com.api.ecommerce.repository;

import com.api.ecommerce.model.Compra;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CompraRepository extends JpaRepository<Compra, Long> {
    
}