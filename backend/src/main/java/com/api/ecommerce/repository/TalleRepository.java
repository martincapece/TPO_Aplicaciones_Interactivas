package com.api.ecommerce.repository;

import com.api.ecommerce.model.Talle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TalleRepository extends JpaRepository<Talle, Long> {
}