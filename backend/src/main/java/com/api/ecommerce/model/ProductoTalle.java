package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "producto_talle")
@Data
public class ProductoTalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_producto_talle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sku", nullable = false)
    private Producto producto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "talle", nullable = false)
    private Talle talle;

    @Column(name = "stock", nullable = false)
    private Integer stock;
}