package com.api.ecommerce.exceptions;

public class EmailEnvioException extends RuntimeException {
    public EmailEnvioException(String mensaje) {
        super(mensaje);
    }

    public EmailEnvioException(String mensaje, Throwable causa) {
        super(mensaje, causa);
    }
}
