package com.api.ecommerce.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface CloudinaryService {
    Map<String, Object> subirImagen(MultipartFile archivo, Long skuProducto, String transformaciones);
    List<Map<String, Object>> subirMultiplesImagenes(MultipartFile[] archivos, Long skuProducto);
    boolean eliminarImagen(String publicId);
    String generarUrlTransformada(String publicId, String transformacion);
    String generarUrlResponsiva(String publicId);
}