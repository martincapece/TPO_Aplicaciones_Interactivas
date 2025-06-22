package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "imagen_producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImagenProducto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "sku_producto", nullable = false)
    private Long skuProducto;
    
    @Column(name = "cloudinary_public_id", nullable = false)
    private String cloudinaryPublicId;
    
    @Column(name = "cloudinary_url", nullable = false, length = 500)
    private String cloudinaryUrl;
    
    @Column(name = "cloudinary_secure_url", nullable = false, length = 500)
    private String cloudinarySecureUrl;
    
    @Column(name = "nombre_original")
    private String nombreOriginal;
    
    @Column(name = "formato")
    private String formato;
    
    @Column(name = "ancho")
    private Integer ancho;
    
    @Column(name = "alto")
    private Integer alto;
    
    @Column(name = "tamaño_bytes")
    private Long tamañoBytes;
    
    @Column(name = "es_principal")
    private Boolean esPrincipal = false;
    
    @Column(name = "orden_visualizacion")
    private Integer ordenVisualizacion = 0;
    
    @Column(name = "fecha_subida")
    private LocalDateTime fechaSubida;
    
    @Column(name = "alt_text")
    private String altText;
    
    @PrePersist
    protected void onCreate() {
        fechaSubida = LocalDateTime.now();
    }
}