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
        return guardarMultiplesImagenes(archivos, sku, null);
    }

    @Override
    @Transactional
    public List<ImagenProducto> guardarMultiplesImagenes(MultipartFile[] archivos, Long sku, Integer indicePrincipal) {

        Producto producto = productoRepository.findById(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Validar que el índice principal esté dentro del rango válido
        if (indicePrincipal != null && (indicePrincipal < 0 || indicePrincipal >= archivos.length)) {
            throw new RuntimeException("El índice de la imagen principal debe estar entre 0 y " + (archivos.length - 1));
        }

        List<Map<String, Object>> resultados = cloudinaryService.subirMultiplesImagenes(archivos, sku);
        List<ImagenProducto> guardadas = new ArrayList<>();

        int ordenBase = imagenProductoRepository.findMaxOrdenByProductoSku(sku).orElse(0);
        boolean yaExistePrincipal = imagenProductoRepository
                .countByProductoSkuAndEsPrincipalTrue(sku) > 0;

        // Si se especifica una imagen principal y ya existe una, desmarcar la actual
        if (indicePrincipal != null && yaExistePrincipal) {
            imagenProductoRepository.findByProductoSkuAndEsPrincipalTrue(sku)
                    .forEach(img -> {
                        img.setEsPrincipal(false);
                        imagenProductoRepository.save(img);
                    });
            yaExistePrincipal = false;
        }

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
            
            // Determinar si esta imagen es la principal
            boolean esPrincipal = false;
            if (indicePrincipal != null) {
                // Si se especificó un índice, solo esa imagen es principal
                esPrincipal = (i == indicePrincipal);
            } else {
                // Si no se especificó, usar la lógica original (primera imagen si no hay principal)
                esPrincipal = (!yaExistePrincipal && i == 0);
            }
            
            img.setEsPrincipal(esPrincipal);
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

    @Override
    @Transactional
    public List<ImagenProducto> reemplazarImagenes(Long[] idsAReemplazar, MultipartFile[] nuevasImagenes, Long sku, Integer indicePrincipal) {
        
        // Validaciones básicas
        if (idsAReemplazar.length != nuevasImagenes.length) {
            throw new RuntimeException("El número de IDs a reemplazar debe coincidir con el número de nuevas imágenes");
        }
        
        if (indicePrincipal != null && (indicePrincipal < 0 || indicePrincipal >= nuevasImagenes.length)) {
            throw new RuntimeException("El índice de la imagen principal debe estar entre 0 y " + (nuevasImagenes.length - 1));
        }

        Producto producto = productoRepository.findById(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Obtener las imágenes a reemplazar y validar que pertenezcan al producto
        List<ImagenProducto> imagenesAReemplazar = new ArrayList<>();
        for (Long id : idsAReemplazar) {
            ImagenProducto img = imagenProductoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Imagen con ID " + id + " no encontrada"));
            
            if (!img.getProducto().getSku().equals(sku)) {
                throw new RuntimeException("La imagen con ID " + id + " no pertenece al producto especificado");
            }
            
            imagenesAReemplazar.add(img);
        }

        // Guardar información sobre cuál era principal antes del reemplazo
        boolean algunaEraOriginalmentePrincipal = imagenesAReemplazar.stream()
                .anyMatch(ImagenProducto::getEsPrincipal);

        // Si se va a reemplazar la imagen principal y no se especifica nueva principal,
        // hacer que la primera nueva imagen sea principal
        if (algunaEraOriginalmentePrincipal && indicePrincipal == null) {
            indicePrincipal = 0;
        }

        // Subir las nuevas imágenes
        List<Map<String, Object>> resultados = cloudinaryService.subirMultiplesImagenes(nuevasImagenes, sku);
        List<ImagenProducto> nuevasImagenesGuardadas = new ArrayList<>();

        // Si se va a establecer una nueva imagen como principal, desmarcar todas las actuales
        if (indicePrincipal != null) {
            imagenProductoRepository.findByProductoSkuAndEsPrincipalTrue(sku)
                    .forEach(img -> {
                        img.setEsPrincipal(false);
                        imagenProductoRepository.save(img);
                    });
        }

        // Crear las nuevas imágenes manteniendo el orden de visualización de las originales
        for (int i = 0; i < resultados.size(); i++) {
            Map<String, Object> res = resultados.get(i);
            ImagenProducto imagenOriginal = imagenesAReemplazar.get(i);

            ImagenProducto nuevaImagen = new ImagenProducto();
            nuevaImagen.setProducto(producto);
            nuevaImagen.setCloudinaryPublicId((String) res.get("public_id"));
            nuevaImagen.setCloudinaryUrl((String) res.get("url"));
            nuevaImagen.setCloudinarySecureUrl((String) res.get("secure_url"));
            nuevaImagen.setNombreOriginal(nuevasImagenes[i].getOriginalFilename());
            nuevaImagen.setFormato((String) res.get("format"));
            nuevaImagen.setAncho((Integer) res.get("width"));
            nuevaImagen.setAlto((Integer) res.get("height"));
            nuevaImagen.setTamañoBytes(((Number) res.get("bytes")).longValue());
            
            // Mantener el orden de visualización de la imagen original
            nuevaImagen.setOrdenVisualizacion(imagenOriginal.getOrdenVisualizacion());
            
            // Establecer si es principal
            nuevaImagen.setEsPrincipal(indicePrincipal != null && i == indicePrincipal);

            nuevasImagenesGuardadas.add(imagenProductoRepository.save(nuevaImagen));
        }

        // Eliminar las imágenes originales (después de guardar las nuevas para evitar problemas)
        imagenesAReemplazar.forEach(img -> {
            cloudinaryService.eliminarImagen(img.getCloudinaryPublicId());
            imagenProductoRepository.delete(img);
        });

        return nuevasImagenesGuardadas;
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