package com.api.ecommerce.service.implementation;

import com.api.ecommerce.exceptions.EmailEnvioException;
import com.api.ecommerce.model.Compra;
import com.api.ecommerce.model.ItemCompra;
import com.api.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Locale;
import java.time.format.DateTimeFormatter;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender emailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Override
    public void enviarConfirmacionCompra(Compra compra) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("sapah.sneakers.org@gmail.com");
            helper.setTo(compra.getCliente().getMail());
            helper.setSubject("Confirmación de compra - Sapah Sneakers #" + compra.getNroCompra());

            String contenido = generarContenidoEmail(compra);
            helper.setText(contenido, true);

            emailSender.send(message);
        } catch (MessagingException e) {
            throw new EmailEnvioException("Error al enviar el email de confirmación", e);
        }
    }

    private String generarContenidoEmail(Compra compra) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss")
                .withLocale(new Locale("es", "AR"))
                .withZone(ZoneId.systemDefault());

        StringBuilder contenido = new StringBuilder();

        ZonedDateTime zonedDateTime = compra.getFecha().atZone(ZoneId.systemDefault());
        String fechaFormateada = formatter.format(zonedDateTime);

        contenido.append("<html><body>");
        contenido.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>");

        // Encabezado
        contenido.append("<h1 style='color: #333;'>¡Gracias por tu compra!</h1>");
        contenido.append("<p>Hola ").append(compra.getCliente().getNombreCompleto()).append(",</p>");
        contenido.append("<p>Tu pedido #").append(compra.getNroCompra()).append(" ha sido confirmado.</p>");

        // Detalles de la compra
        contenido.append("<div style='margin: 20px 0;'>");
        contenido.append("<h2 style='color: #333;'>Detalles de la compra:</h2>");
        contenido.append("<p><strong>Fecha:</strong> ")
                .append(fechaFormateada)
                .append("</p>");
        contenido.append("<p><strong>Método de pago:</strong> ").append(compra.getMedioPago()).append("</p>");

        // Tabla de productos
        contenido.append("<table style='width: 100%; border-collapse: collapse; margin-top: 20px;'>");
        contenido.append("<tr style='background-color: #f8f8f8;'>");
        contenido.append("<th style='padding: 10px; border: 1px solid #ddd;'>Producto</th>");
        contenido.append("<th style='padding: 10px; border: 1px solid #ddd;'>Talle</th>");
        contenido.append("<th style='padding: 10px; border: 1px solid #ddd;'>Cantidad</th>");
        contenido.append("<th style='padding: 10px; border: 1px solid #ddd;'>Precio Unit.</th>");
        contenido.append("<th style='padding: 10px; border: 1px solid #ddd;'>Subtotal</th>");
        contenido.append("</tr>");

        // Productos
        for (ItemCompra item : compra.getItems()) {
            contenido.append("<tr>");
            contenido.append("<td style='padding: 10px; border: 1px solid #ddd;'>")
                    .append(item.getProductoTalle().getProducto().getModelo())
                    .append("</td>");
            contenido.append("<td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>")  // Agregamos text-align: center
                    .append(item.getProductoTalle().getTalle().getNumero())
                    .append("</td>");
            contenido.append("<td style='padding: 10px; border: 1px solid #ddd; text-align: center;'>")
                    .append(item.getCantidad())
                    .append("</td>");
            contenido.append("<td style='padding: 10px; border: 1px solid #ddd; text-align: right;'>")
                    .append(String.format("$%.2f", item.getProductoTalle().getPrecioUnitario()))
                    .append("</td>");
            contenido.append("<td style='padding: 10px; border: 1px solid #ddd; text-align: right;'>")
                    .append(String.format("$%.2f", item.getSubtotal()))
                    .append("</td>");
            contenido.append("</tr>");

        }

        // Total
        contenido.append("<tr style='background-color: #f8f8f8;'>");
        contenido.append("<td colspan='4' style='padding: 10px; border: 1px solid #ddd; text-align: right;'><strong>Total:</strong></td>");
        contenido.append("<td style='padding: 10px; border: 1px solid #ddd; text-align: right;'><strong>")
                .append(String.format("$%.2f", compra.getPrecioFinal()))
                .append("</strong></td>");
        contenido.append("</tr>");
        contenido.append("</table>");

        // Pie del email
        contenido.append("<p style='margin-top: 20px;'>Gracias por confiar en Sapah Sneakers.</p>");
        contenido.append("<p>Si tienes alguna pregunta, no dudes en contactarnos.</p>");
        contenido.append("</div>");
        contenido.append("</body></html>");

        return contenido.toString();
    }
}