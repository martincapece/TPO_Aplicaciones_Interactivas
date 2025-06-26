package com.api.ecommerce.exceptions;

public class NombreUsuarioYaExisteException extends RuntimeException {
    public NombreUsuarioYaExisteException(String username) {
        super("Ya existe un usuario registrado con el nombre de usuario: " + username);
    }
}