package com.api.ecommerce.dto;

import java.io.Serializable;

public record ItemCompraRequestDTO(
        Long sku,
        String talle,
        int cantidad

) implements Serializable {}
