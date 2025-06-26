package com.api.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

public record RegisterRequestDTO(
        String nombreCompleto,
        String usuario,
        String mail,
        String contraseña

) implements Serializable {}
