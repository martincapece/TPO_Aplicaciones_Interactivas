package com.api.ecommerce.service;

import com.api.ecommerce.model.ImagenProducto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImagenProductoService {
    

    List<ImagenProducto> obtenerTodos();
    List<ImagenProducto> obtenerImagenPorIdProducto(Long sku);
    void borrarImagen(Long id);
    void deleteByProductoSku(Long sku);
    

    ImagenProducto guardarImagen(MultipartFile archivo, Long skuProducto, boolean esPrincipal);
    List<ImagenProducto> guardarMultiplesImagenes(MultipartFile[] archivos, Long skuProducto);
    List<ImagenProducto> guardarMultiplesImagenes(MultipartFile[] archivos, Long skuProducto, Integer indicePrincipal);
    List<ImagenProducto> reemplazarImagenes(Long[] idsAReemplazar, MultipartFile[] nuevasImagenes, Long sku, Integer indicePrincipal);
    String generarUrlResponsiva(Long id);
    String generarUrlTransformada(Long id, String transformacion);
    

}