package com.api.ecommerce.dto;

public record CompraDTO(
    Long nroCompra,
    String nombreComprador,
    String emailComprador,
    Long fechaTimestamp,
    Double montoTotal,
    String medioPago,
    Integer cantidadItems
) {}