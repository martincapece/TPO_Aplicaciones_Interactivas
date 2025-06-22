package com.api.ecommerce.dto;

import java.io.Serializable;
import java.util.List;

public record CompraRequestDTO(
        Long idCliente,
        String medioPago,
        List<ItemCompraRequestDTO> items
) implements Serializable {}
