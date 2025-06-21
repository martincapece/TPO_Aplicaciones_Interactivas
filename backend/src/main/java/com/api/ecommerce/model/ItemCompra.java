package com.api.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "item_compra")
@Data
public class ItemCompra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItemCompra;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nro_compra", nullable = false)
    @JsonBackReference("compra-items")
    private Compra compra;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_producto_talle", nullable = false)
    private ProductoTalle productoTalle;

    @Column(name = "cantidad", nullable = false)
    private Integer cantidad;

    public double getSubtotal() {
        if (productoTalle == null) {
            return 0;
        }
        return productoTalle.getPrecioUnitario();
    }

}