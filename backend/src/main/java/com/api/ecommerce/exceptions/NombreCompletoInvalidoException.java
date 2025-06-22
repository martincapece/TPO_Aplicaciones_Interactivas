package com.api.ecommerce.exceptions;

public class NombreCompletoInvalidoException extends RuntimeException {
    public NombreCompletoInvalidoException(String mensaje) {
        super(mensaje);
    }
    
    public NombreCompletoInvalidoException() {
        super("El nombre completo debe contener al menos nombre y apellido separados por un espacio");
    }
}