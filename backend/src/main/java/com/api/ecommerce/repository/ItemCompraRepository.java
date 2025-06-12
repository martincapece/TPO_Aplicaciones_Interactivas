package com.api.ecommerce.repository;

import com.api.ecommerce.model.ItemCompra;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface ItemCompraRepository extends JpaRepository<ItemCompra, Long> {
    
}
