package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "producto")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Producto {

    @Id
    @Column(name = "sku", length = 50, nullable = false)
    private String sku;

    private String modelo;
    private String marca;
    private String color;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal precio;

    @Column(columnDefinition = "text")
    private String descripcion;

    private Boolean destacado;
    private Boolean nuevo;
}