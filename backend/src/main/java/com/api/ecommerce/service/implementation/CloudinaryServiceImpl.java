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
import java.util.*;

@Service
@Slf4j
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    private final CloudinaryConfig config;

    public CloudinaryServiceImpl(Cloudinary cloudinary, CloudinaryConfig config) {
        this.cloudinary = cloudinary;
        this.config = config;
    }

    /* ====================================================================== */
    /*  SUBIR UNA IMAGEN                                                     */
    /* ====================================================================== */
    @Override
    public Map<String, Object> subirImagen(MultipartFile archivo,
                                           Long         skuProducto,
                                           String       transformaciones) {

        try {
            validarArchivo(archivo);

            Map<String, Object> uploadParams = new HashMap<>();
            uploadParams.put("folder", config.getFolder());
            uploadParams.put("public_id", generarPublicId(skuProducto, archivo.getOriginalFilename()));
            uploadParams.put("resource_type", "image");
            // ───────────────────────────────────────────────────────────────
            //  Transformaciones
            // ───────────────────────────────────────────────────────────────
            if (transformaciones != null && !transformaciones.isBlank()) {
                // El string llega del caller (ej: "c_fill,w_800,h_800,q_auto:good,f_auto")
                uploadParams.put("transformation", transformaciones);
            } else {
                // Transformación por defecto usando el builder de Cloudinary
                Transformation defaultTx = new Transformation()
                        .quality("auto:good")
                        .fetchFormat("auto")
                        .crop("limit")
                        .width(1200)
                        .height(1200);

                uploadParams.put("transformation", defaultTx);
            }

            // Etiquetas (opcional)
            uploadParams.put("tags", List.of("producto", "sku_" + skuProducto));

            Map<String, Object> result =
                    cloudinary.uploader().upload(archivo.getBytes(), uploadParams);

            log.info("Imagen subida exitosamente. Public ID: {}", result.get("public_id"));
            return result;

        } catch (IOException e) {
            log.error("Error al subir imagen a Cloudinary", e);
            throw new RuntimeException("Error al subir imagen", e);
        }
    }

    /* ====================================================================== */
    /*  SUBIR VARIAS IMÁGENES                                                 */
    /* ====================================================================== */
    @Override
    public List<Map<String, Object>> subirMultiplesImagenes(MultipartFile[] archivos,
                                                            Long           skuProducto) {

        List<Map<String, Object>> resultados = new ArrayList<>();
        String txPrincipal   = getTransformacionesPrincipal();
        String txSecundaria  = getTransformacionesSecundarias();

        for (int i = 0; i < archivos.length; i++) {
            try {
                String tx = (i == 0) ? txPrincipal : txSecundaria;
                Map<String, Object> res = subirImagen(archivos[i], skuProducto, tx);
                resultados.add(res);
            } catch (Exception e) {
                log.error("Error subiendo archivo: {}", archivos[i].getOriginalFilename(), e);
            }
        }
        return resultados;
    }

    /* ====================================================================== */
    /*  ELIMINAR IMAGEN                                                       */
    /* ====================================================================== */
    @Override
    public boolean eliminarImagen(String publicId) {
        try {
            Map<String, Object> result =
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Error al eliminar imagen de Cloudinary: {}", publicId, e);
            return false;
        }
    }

    /* ====================================================================== */
    /*  GENERAR URLS                                                         */
    /* ====================================================================== */
    @Override
    public String generarUrlTransformada(String publicId, String transformacion) {
        // El string 'transformacion' debe ir en formato corto Cloudinary, ej. "e_grayscale,q_60"
        Transformation t = new Transformation().rawTransformation(transformacion);
        return cloudinary.url().transformation(t).generate(publicId);
    }

    @Override
    public String generarUrlResponsiva(String publicId) {
        Transformation t = new Transformation()
                .crop("scale")
                .width("auto")
                .dpr("auto")
                .fetchFormat("auto")
                .quality("auto");
        return cloudinary.url().transformation(t).generate(publicId);
    }

    /* ====================================================================== */
    /*  MÉTODOS PRIVADOS                                                     */
    /* ====================================================================== */
    private void validarArchivo(MultipartFile archivo) {
        if (archivo.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        if (archivo.getSize() > config.getMaxFileSize()) {
            throw new IllegalArgumentException(
                    "El archivo es muy grande. Máximo: " + config.getMaxFileSize() + " bytes");
        }
        String contentType = archivo.getContentType();
        if (!List.of("image/jpeg", "image/png", "image/webp", "image/gif").contains(contentType)) {
            throw new IllegalArgumentException(
                    "Tipo de archivo no válido. Solo se permiten: JPEG, PNG, WebP, GIF");
        }
    }

    private String generarPublicId(Long skuProducto, String nombreOriginal) {
        String timestamp    = String.valueOf(System.currentTimeMillis());
        String nombreLimpio = nombreOriginal.replaceAll("[^a-zA-Z0-9.-]", "_");
        return "producto_" + skuProducto + "_" + timestamp + "_" + nombreLimpio;
    }

    private String getTransformacionesPrincipal()   { return "c_fill,w_800,h_800,q_auto:good,f_auto"; }
    private String getTransformacionesSecundarias() { return "c_fill,w_600,h_600,q_auto:good,f_auto"; }
}
