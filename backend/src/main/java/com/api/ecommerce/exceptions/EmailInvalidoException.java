package com.api.ecommerce.exceptions;

public class EmailInvalidoException extends RuntimeException {
    public EmailInvalidoException(String email) {
        super("El formato del email '" + email + "' no es válido");
    }
    
    public EmailInvalidoException() {
        super("El formato del email no es válido");
    }
}