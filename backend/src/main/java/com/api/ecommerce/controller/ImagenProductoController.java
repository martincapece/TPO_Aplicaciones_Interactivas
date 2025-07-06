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
            @RequestParam("archivos") MultipartFile[] archivos,
            @RequestParam(required = false) Integer indicePrincipal) {
        
        try {
            List<ImagenProducto> imagenes;
            if (indicePrincipal != null) {
                imagenes = imagenProductoService.guardarMultiplesImagenes(archivos, sku, indicePrincipal);
            } else {
                imagenes = imagenProductoService.guardarMultiplesImagenes(archivos, sku);
            }
            
            // Verificar si alguna de las imágenes subidas es principal
            boolean hayPrincipalEnSubidas = imagenes.stream().anyMatch(ImagenProducto::getEsPrincipal);
            
            // Obtener información sobre la imagen principal actual del producto
            List<ImagenProducto> todasLasImagenes = imagenProductoService.obtenerImagenPorIdProducto(sku);
            ImagenProducto imagenPrincipalActual = todasLasImagenes.stream()
                .filter(ImagenProducto::getEsPrincipal)
                .findFirst()
                .orElse(null);
            
            String mensajePrincipal;
            if (hayPrincipalEnSubidas) {
                mensajePrincipal = "Una de las imágenes subidas fue establecida como principal";
            } else if (imagenPrincipalActual != null) {
                mensajePrincipal = "Las imágenes se agregaron como secundarias. La imagen principal existente se mantiene";
            } else {
                mensajePrincipal = "No hay imagen principal definida para este producto";
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Imágenes subidas exitosamente",
                "imagenes", imagenes,
                "cantidad", imagenes.size(),
                "imagenPrincipal", mensajePrincipal
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

    @PutMapping("/replace/{sku}")
    public ResponseEntity<?> reemplazarImagenes(
            @PathVariable Long sku,
            @RequestParam("idsAReemplazar") Long[] idsAReemplazar,
            @RequestParam("archivos") MultipartFile[] archivos,
            @RequestParam(required = false) Integer indicePrincipal) {
        
        try {
            List<ImagenProducto> imagenes = imagenProductoService.reemplazarImagenes(idsAReemplazar, archivos, sku, indicePrincipal);
            
            String mensajePrincipal;
            boolean hayPrincipalEnNuevas = imagenes.stream().anyMatch(ImagenProducto::getEsPrincipal);
            
            if (hayPrincipalEnNuevas) {
                mensajePrincipal = "Una de las nuevas imágenes fue establecida como principal";
            } else {
                // Verificar si hay imagen principal en el producto
                List<ImagenProducto> todasLasImagenes = imagenProductoService.obtenerImagenPorIdProducto(sku);
                boolean hayPrincipalEnProducto = todasLasImagenes.stream().anyMatch(ImagenProducto::getEsPrincipal);
                mensajePrincipal = hayPrincipalEnProducto ? 
                    "Las imágenes fueron reemplazadas. La imagen principal se mantiene en otra imagen" :
                    "Las imágenes fueron reemplazadas. No hay imagen principal definida";
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Imágenes reemplazadas exitosamente",
                "imagenesReemplazadas", imagenes,
                "cantidad", imagenes.size(),
                "imagenPrincipal", mensajePrincipal
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}