package com.api.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_producto")
@Data
public class ImagenProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idImagen;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sku", nullable = false)
    @JsonBackReference("producto-imagenes")  // O usar @JsonIgnore como alternativa
    private Producto producto;

    @Column(name = "url", columnDefinition = "text", nullable = false, unique = true)
    private String url;

    @Column(name = "orden")
    private Integer orden;
}