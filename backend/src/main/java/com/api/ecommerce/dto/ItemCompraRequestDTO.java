package com.api.ecommerce.dto;

import java.io.Serializable;

public record ItemCompraRequestDTO(
        Long idProducto,
        int cantidad

) implements Serializable {}
