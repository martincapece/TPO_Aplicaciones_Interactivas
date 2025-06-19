package com.api.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "compra")
@Data
public class Compra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nroCompra;

    @ManyToOne
    @JoinColumn(name = "id_cliente", nullable = false)
    private Cliente cliente;

    @Column(name = "fecha", nullable = false)
    private LocalDateTime fecha;

    @Column(name = "precio_final", nullable = false)
    private double precioFinal;

    @Column(name = "medio_pago", nullable = false)
    private String medioPago;

    @OneToMany(mappedBy = "compra", cascade = CascadeType.ALL)
    @JsonManagedReference("compra-items")
    private List<ItemCompra> items;

    /**
     * Calcula el precio final sumando todos los subtotales de los items
     * @return el precio final calculado
     */
    public double calcularPrecioFinal() {
        if (items == null || items.isEmpty()) {
            return 0.0;
        }

        return items.stream()
                .mapToDouble(ItemCompra::calcularSubtotal)
                .sum();
    }

    /**
     * Actualiza el campo precioFinal con la suma de todos los subtotales
     */
    public void actualizarPrecioFinal() {
        this.precioFinal = calcularPrecioFinal();
    }
}