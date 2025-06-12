package com.api.ecommerce.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClienteRegisterDTO {
    private String nombre_completo;
    private String usuario;
    private String mail;
    private String contraseña;
}
