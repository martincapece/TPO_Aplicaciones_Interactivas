package com.api.ecommerce.service;

import com.api.ecommerce.model.Compra;
import com.api.ecommerce.exceptions.EmailEnvioException;

public interface EmailService {
	/**
	 * Envía un email de confirmación de compra al cliente
	 * @param compra La compra realizada que contiene los detalles y la información del cliente
	 * @throws MessagingException Si ocurre un error al enviar el email
	 */
	void enviarConfirmacionCompra(Compra compra) throws EmailEnvioException;
}