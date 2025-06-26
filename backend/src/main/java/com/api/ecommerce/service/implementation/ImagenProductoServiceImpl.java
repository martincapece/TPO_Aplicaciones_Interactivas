package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.*;
import com.api.ecommerce.repository.*;
import com.api.ecommerce.service.ImagenProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagenProductoServiceImpl implements ImagenProductoService {

    private final ImagenProductoRepository imagenProductoRepository;
    private final ProductoRepository productoRepository;
    private final CloudinaryServiceImpl cloudinaryService;

    /* ---------- lecturas ---------- */

    @Override
    public List<ImagenProducto> obtenerTodos() {
        return imagenProductoRepository.findAll();
    }

    @Override
    public List<ImagenProducto> obtenerImagenPorIdProducto(Long sku) {
        return imagenProductoRepository.findByProductoSkuOrderByOrdenVisualizacionAsc(sku);
    }

    /* ---------- escrituras ---------- */

    @Override
    @Transactional
    public void deleteByProductoSku(Long sku) {
        List<ImagenProducto> imagenes = obtenerImagenPorIdProducto(sku);
        imagenes.forEach(img -> cloudinaryService.eliminarImagen(img.getCloudinaryPublicId()));
        imagenProductoRepository.deleteByProductoSku(sku);
    }

    @Override
    @Transactional
    public ImagenProducto guardarImagen(MultipartFile archivo, Long sku, boolean esPrincipal) {

        Producto producto = productoRepository.findById(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        if (esPrincipal) {
            imagenProductoRepository.findByProductoSkuAndEsPrincipalTrue(sku)
                    .forEach(img -> {
                        img.setEsPrincipal(false);
                        imagenProductoRepository.save(img);
                    });
        }

        Map<String, Object> res = cloudinaryService.subirImagen(archivo, sku, null);

        ImagenProducto imagen = new ImagenProducto();
        imagen.setProducto(producto);
        imagen.setCloudinaryPublicId((String) res.get("public_id"));
        imagen.setCloudinaryUrl((String) res.get("url"));
        imagen.setCloudinarySecureUrl((String) res.get("secure_url"));
        imagen.setNombreOriginal(archivo.getOriginalFilename());
        imagen.setFormato((String) res.get("format"));
        imagen.setAncho((Integer) res.get("width"));
        imagen.setAlto((Integer) res.get("height"));
        imagen.setTamañoBytes(((Number) res.get("bytes")).longValue());
        imagen.setEsPrincipal(esPrincipal);

        int maxOrden = imagenProductoRepository.findMaxOrdenByProductoSku(sku).orElse(0);
        imagen.setOrdenVisualizacion(maxOrden + 1);

        return imagenProductoRepository.save(imagen);
    }

    @Override
    @Transactional
    public List<ImagenProducto> guardarMultiplesImagenes(MultipartFile[] archivos, Long sku) {

        Producto producto = productoRepository.findById(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        List<Map<String, Object>> resultados = cloudinaryService.subirMultiplesImagenes(archivos, sku);
        List<ImagenProducto> guardadas = new ArrayList<>();

        int ordenBase = imagenProductoRepository.findMaxOrdenByProductoSku(sku).orElse(0);
        boolean yaExistePrincipal = imagenProductoRepository
                .countByProductoSkuAndEsPrincipalTrue(sku) > 0;

        for (int i = 0; i < resultados.size(); i++) {
            Map<String, Object> res = resultados.get(i);

            ImagenProducto img = new ImagenProducto();
            img.setProducto(producto);
            img.setCloudinaryPublicId((String) res.get("public_id"));
            img.setCloudinaryUrl((String) res.get("url"));
            img.setCloudinarySecureUrl((String) res.get("secure_url"));
            img.setNombreOriginal(archivos[i].getOriginalFilename());
            img.setFormato((String) res.get("format"));
            img.setAncho((Integer) res.get("width"));
            img.setAlto((Integer) res.get("height"));
            img.setTamañoBytes(((Number) res.get("bytes")).longValue());
            img.setEsPrincipal(!yaExistePrincipal && i == 0);
            img.setOrdenVisualizacion(ordenBase + i + 1);

            guardadas.add(imagenProductoRepository.save(img));
        }

        return guardadas;
    }

    @Override
    @Transactional
    public void borrarImagen(Long id) {
        ImagenProducto imagen = imagenProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        cloudinaryService.eliminarImagen(imagen.getCloudinaryPublicId());
        imagenProductoRepository.delete(imagen);
    }

    /* ---------- URLs ---------- */

    @Override
    public String generarUrlResponsiva(Long id) {
        ImagenProducto img = imagenProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        return cloudinaryService.generarUrlResponsiva(img.getCloudinaryPublicId());
    }

    @Override
    public String generarUrlTransformada(Long id, String transformacion) {
        ImagenProducto img = imagenProductoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        return cloudinaryService.generarUrlTransformada(img.getCloudinaryPublicId(), transformacion);
    }
}