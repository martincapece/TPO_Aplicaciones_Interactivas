package com.api.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "producto")
@Data
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sku;

    @Column(name = "modelo", nullable = false)
    private String modelo;

    @Column(name = "marca", nullable = false)
    private String marca;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "precio", nullable = false)
    private double precio;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "destacado")
    private Boolean destacado;

    @Column(name = "nuevo")
    private Boolean nuevo;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ProductoTalle> talles;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ImagenProducto> imagenes;
}