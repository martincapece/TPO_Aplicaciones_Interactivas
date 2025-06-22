package com.api.ecommerce.service.implementation;

import com.api.ecommerce.config.CloudinaryConfig;
import com.api.ecommerce.service.CloudinaryService;
import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {
    
    private final Cloudinary cloudinary;
    private final CloudinaryConfig config;
    
    public CloudinaryServiceImpl(Cloudinary cloudinary, CloudinaryConfig config) {
        this.cloudinary = cloudinary;
        this.config = config;
    }
    
    public Map<String, Object> subirImagen(MultipartFile archivo, Long skuProducto, String transformaciones) {
        try {
            validarArchivo(archivo);
            
            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", config.getFolder());
            uploadParams.put("public_id", generarPublicId(skuProducto, archivo.getOriginalFilename()));
            uploadParams.put("resource_type", "image");
            uploadParams.put("quality", "auto:good");
            uploadParams.put("fetch_format", "auto");
            
            // Transformaciones automáticas
            if (transformaciones != null && !transformaciones.isEmpty()) {
                uploadParams.put("transformation", transformaciones);
            } else {
                // Transformaciones por defecto
                uploadParams.put("transformation", Arrays.asList(
                    Map.of("quality", "auto:good"),
                    Map.of("fetch_format", "auto"),
                    Map.of("width", 1200, "height", 1200, "crop", "limit")
                ));
            }
            
            // Tags para organización
            uploadParams.put("tags", Arrays.asList("producto", "sku_" + skuProducto));
            
            Map<String, Object> result = cloudinary.uploader().upload(archivo.getBytes(), uploadParams);
            
            log.info("Imagen subida exitosamente. Public ID: {}", result.get("public_id"));
            return result;
            
        } catch (IOException e) {
            log.error("Error al subir imagen a Cloudinary", e);
            throw new RuntimeException("Error al subir imagen", e);
        }
    }
    
    public List<Map<String, Object>> subirMultiplesImagenes(MultipartFile[] archivos, Long skuProducto) {
        List<Map<String, Object>> resultados = new ArrayList<>();
        
        for (int i = 0; i < archivos.length; i++) {
            try {
                String transformaciones = i == 0 ? getTransformacionesPrincipal() : getTransformacionesSecundarias();
                Map<String, Object> resultado = subirImagen(archivos[i], skuProducto, transformaciones);
                resultados.add(resultado);
            } catch (Exception e) {
                log.error("Error subiendo archivo: {}", archivos[i].getOriginalFilename(), e);
            }
        }
        
        return resultados;
    }
    
    public boolean eliminarImagen(String publicId) {
        try {
            Map<String, Object> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Error al eliminar imagen de Cloudinary: {}", publicId, e);
            return false;
        }
    }
    
    public String generarUrlTransformada(String publicId, String transformacion) {
        // Crear transformación desde string
        Transformation t = new Transformation();
        t.rawTransformation(transformacion);
        
        return cloudinary.url()
                .transformation(t)
                .generate(publicId);
    }
    
    public String generarUrlResponsiva(String publicId) {
        return cloudinary.url()
                .transformation(new Transformation()
                    .crop("scale")
                    .width("auto")
                    .dpr("auto")
                    .fetchFormat("auto")
                    .quality("auto"))
                .generate(publicId);
    }
    
    private void validarArchivo(MultipartFile archivo) {
        if (archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        
        if (archivo.getSize() > config.getMaxFileSize()) {
            throw new IllegalArgumentException("El archivo es muy grande. Máximo: " + config.getMaxFileSize() + " bytes");
        }
        
        String contentType = archivo.getContentType();
        if (!Arrays.asList("image/jpeg", "image/png", "image/webp", "image/gif").contains(contentType)) {
            throw new IllegalArgumentException("Tipo de archivo no válido. Solo se permiten: JPEG, PNG, WebP, GIF");
        }
    }
    
    private String generarPublicId(Long skuProducto, String nombreOriginal) {
        String timestamp = String.valueOf(System.currentTimeMillis());
        String nombreLimpio = nombreOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");
        return "producto_" + skuProducto + "_" + timestamp + "_" + nombreLimpio;
    }
    
    private String getTransformacionesPrincipal() {
        return "c_fill,w_800,h_800,q_auto:good,f_auto";
    }
    
    private String getTransformacionesSecundarias() {
        return "c_fill,w_600,h_600,q_auto:good,f_auto";
    }
}