package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "imagen_producto")
@Data
public class ImagenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idImagen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sku", nullable = false)
    private Producto producto;

    @Column(name = "url", columnDefinition = "text", nullable = false)
    private String url;

    @Column(name = "orden")
    private Integer orden;
}