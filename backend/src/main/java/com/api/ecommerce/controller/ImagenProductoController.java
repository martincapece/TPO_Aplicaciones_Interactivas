package com.api.ecommerce.controller;

import com.api.ecommerce.model.ImagenProducto;
import com.api.ecommerce.service.ImagenProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/imagenes")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ImagenProductoController {
    
    private final ImagenProductoService imagenProductoService;
    
    @PostMapping("/upload/{sku}")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long sku,
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam(defaultValue = "false") boolean esPrincipal) {
        
        try {
            ImagenProducto imagen = imagenProductoService.guardarImagen(archivo, sku, esPrincipal);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Imagen subida exitosamente",
                "imagen", imagen
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/upload-multiple/{sku}")
    public ResponseEntity<?> subirMultiplesImagenes(
            @PathVariable Long sku,
            @RequestParam("archivos") MultipartFile[] archivos) {
        
        try {
            List<ImagenProducto> imagenes = imagenProductoService.guardarMultiplesImagenes(archivos, sku);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Imágenes subidas exitosamente",
                "imagenes", imagenes,
                "cantidad", imagenes.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @GetMapping("/{sku}")
    public ResponseEntity<List<ImagenProducto>> obtenerImagenesProducto(@PathVariable Long sku) {
        List<ImagenProducto> imagenes = imagenProductoService.obtenerImagenPorIdProducto(sku);
        return ResponseEntity.ok(imagenes);
    }
    
    @GetMapping("/{sku}/principal")
    public ResponseEntity<ImagenProducto> obtenerImagenPrincipal(@PathVariable Long sku) {
        List<ImagenProducto> imagenes = imagenProductoService.obtenerImagenPorIdProducto(sku);
        ImagenProducto principal = imagenes.stream()
            .filter(ImagenProducto::getEsPrincipal)
            .findFirst()
            .orElse(imagenes.isEmpty() ? null : imagenes.get(0));
        
        return principal != null ? ResponseEntity.ok(principal) : ResponseEntity.notFound().build();
    }
    
    @GetMapping("/responsive/{id}")
    public ResponseEntity<Map<String, String>> obtenerUrlResponsiva(@PathVariable Long id) {
        try {
            String url = imagenProductoService.generarUrlResponsiva(id);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/transform/{id}")
    public ResponseEntity<Map<String, String>> obtenerUrlTransformada(
            @PathVariable Long id,
            @RequestParam String transformacion) {
        try {
            String url = imagenProductoService.generarUrlTransformada(id, transformacion);
            return ResponseEntity.ok(Map.of("url", url));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarImagen(@PathVariable Long id) {
        try {
            imagenProductoService.borrarImagen(id);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Imagen eliminada exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
    
    @DeleteMapping("/producto/{sku}")
    public ResponseEntity<?> eliminarTodasImagenesProducto(@PathVariable Long sku) {
        try {
            imagenProductoService.deleteByProductoSku(sku);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Todas las imágenes del producto eliminadas exitosamente"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}