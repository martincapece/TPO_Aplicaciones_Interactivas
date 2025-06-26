package com.api.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;


public record AuthenticationRequestDTO (
        String mail,
        String contraseña

) implements Serializable {}
