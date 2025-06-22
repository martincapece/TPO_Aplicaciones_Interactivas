package com.api.ecommerce.exceptions;

public class DominioEmailInvalidoException extends RuntimeException {
    public DominioEmailInvalidoException(String dominio) {
        super("El dominio de email '" + dominio + "' no es válido o no existe");
    }
}