package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "imagen_producto")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ImagenProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_imagen")
    private Long idImagen;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sku", nullable = false)
    private Producto producto;

    @Column(name = "url", columnDefinition = "text", nullable = false)
    private String url;

    @Column(name = "orden")
    private Integer orden;
}