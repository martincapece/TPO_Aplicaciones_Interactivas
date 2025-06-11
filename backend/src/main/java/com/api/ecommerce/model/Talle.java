package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talle")
@Data
public class Talle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_talle;

    @Column(name = "numero", length = 10, nullable = false)
    private String numero;
}