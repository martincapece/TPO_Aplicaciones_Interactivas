package com.api.ecommerce.dto;

import lombok.Data;

import java.util.List;

@Data
public class CompraCompletaDTO {
    private Long idCliente;
    private String medioPago;
    private List<ItemCompraDTO> items;

    @Data
    public static class ItemCompraDTO {
        private Long idProductoTalle;
        private int cantidad;
        private double precioUnitario;
    }
}
