package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.ImagenProducto;
import com.api.ecommerce.repository.ImagenProductoRepository;
import com.api.ecommerce.service.ImagenProductoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImagenProductoServiceImpl implements ImagenProductoService {
    
    private final ImagenProductoRepository imagenProductoRepository;
    private final CloudinaryServiceImpl cloudinaryService;
    
    @Override
    public List<ImagenProducto> obtenerTodos() {
        return imagenProductoRepository.findAll();
    }
    
    @Override
    public List<ImagenProducto> obtenerImagenPorIdProducto(Long skuProducto) {
        return imagenProductoRepository.findBySkuProductoOrderByOrdenVisualizacionAsc(skuProducto);
    }
    
    @Override
    @Transactional
    public void deleteByProductoSku(Long skuProducto) {
        List<ImagenProducto> imagenes = obtenerImagenPorIdProducto(skuProducto);
        
        // Eliminar de Cloudinary primero
        for (ImagenProducto imagen : imagenes) {
            cloudinaryService.eliminarImagen(imagen.getCloudinaryPublicId());
        }
        
        // Luego eliminar de la base de datos
        imagenProductoRepository.deleteBySkuProducto(skuProducto);
    }
    
    @Override
    @Transactional
    public ImagenProducto guardarImagen(MultipartFile archivo, Long skuProducto, boolean esPrincipal) {
        try {
            // Si es imagen principal, desmarcar la anterior
            if (esPrincipal) {
                List<ImagenProducto> imagenesPrincipales = imagenProductoRepository.findBySkuProductoAndEsPrincipalTrue(skuProducto);
                imagenesPrincipales.forEach(img -> {
                    img.setEsPrincipal(false);
                    imagenProductoRepository.save(img);
                });
            }
            
            // Subir a Cloudinary
            Map<String, Object> resultado = cloudinaryService.subirImagen(archivo, skuProducto, null);
            
            // Crear entidad ImagenProducto
            ImagenProducto imagen = new ImagenProducto();
            imagen.setSkuProducto(skuProducto);
            imagen.setCloudinaryPublicId((String) resultado.get("public_id"));
            imagen.setCloudinaryUrl((String) resultado.get("url"));
            imagen.setCloudinarySecureUrl((String) resultado.get("secure_url"));
            imagen.setNombreOriginal(archivo.getOriginalFilename());
            imagen.setFormato((String) resultado.get("format"));
            imagen.setAncho((Integer) resultado.get("width"));
            imagen.setAlto((Integer) resultado.get("height"));
            imagen.setTamañoBytes(((Number) resultado.get("bytes")).longValue());
            imagen.setEsPrincipal(esPrincipal);
            
            // Establecer orden de visualización
            int maxOrden = imagenProductoRepository.findMaxOrdenBySkuProducto(skuProducto).orElse(0);
            imagen.setOrdenVisualizacion(maxOrden + 1);
            
            return imagenProductoRepository.save(imagen);
            
        } catch (Exception e) {
            log.error("Error guardando imagen para producto {}", skuProducto, e);
            throw new RuntimeException("Error al guardar imagen", e);
        }
    }
    
    @Override
    @Transactional
    public List<ImagenProducto> guardarMultiplesImagenes(MultipartFile[] archivos, Long skuProducto) {
        List<Map<String, Object>> resultados = cloudinaryService.subirMultiplesImagenes(archivos, skuProducto);
        List<ImagenProducto> imagenesGuardadas = new ArrayList<>();
        
        int ordenInicial = imagenProductoRepository.findMaxOrdenBySkuProducto(skuProducto).orElse(0);
        
        for (int i = 0; i < resultados.size(); i++) {
            Map<String, Object> resultado = resultados.get(i);
            
            ImagenProducto imagen = new ImagenProducto();
            imagen.setSkuProducto(skuProducto);
            imagen.setCloudinaryPublicId((String) resultado.get("public_id"));
            imagen.setCloudinaryUrl((String) resultado.get("url"));
            imagen.setCloudinarySecureUrl((String) resultado.get("secure_url"));
            imagen.setNombreOriginal(archivos[i].getOriginalFilename());
            imagen.setFormato((String) resultado.get("format"));
            imagen.setAncho((Integer) resultado.get("width"));
            imagen.setAlto((Integer) resultado.get("height"));
            imagen.setTamañoBytes(((Number) resultado.get("bytes")).longValue());
            imagen.setEsPrincipal(i == 0 && imagenProductoRepository.countBySkuProductoAndEsPrincipalTrue(skuProducto) == 0);
            imagen.setOrdenVisualizacion(ordenInicial + i + 1);
            
            imagenesGuardadas.add(imagenProductoRepository.save(imagen));
        }
        
        return imagenesGuardadas;
    }
    
    @Override
    @Transactional
    public void borrarImagen(Long id) {
        ImagenProducto imagen = imagenProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        
        // Eliminar de Cloudinary
        cloudinaryService.eliminarImagen(imagen.getCloudinaryPublicId());
        
        // Eliminar de base de datos
        imagenProductoRepository.delete(imagen);
    }
    
    @Override
    public String generarUrlResponsiva(Long id) {
        ImagenProducto imagen = imagenProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        
        return cloudinaryService.generarUrlResponsiva(imagen.getCloudinaryPublicId());
    }
    
    @Override
    public String generarUrlTransformada(Long id, String transformacion) {
        ImagenProducto imagen = imagenProductoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Imagen no encontrada"));
        
        return cloudinaryService.generarUrlTransformada(imagen.getCloudinaryPublicId(), transformacion);
    }
}