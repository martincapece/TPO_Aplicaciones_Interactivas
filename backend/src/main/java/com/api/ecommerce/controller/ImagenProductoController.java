package com.api.ecommerce.controller;

import com.api.ecommerce.model.Compra;
import com.api.ecommerce.model.ImagenProducto;
import com.api.ecommerce.service.ImagenProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sapah/imagenes-producto")
@RequiredArgsConstructor
public class ImagenProductoController {

    private final ImagenProductoService imagenProductoService;

    @GetMapping
    public List<ImagenProducto> listarProductos() {
        return imagenProductoService.obtenerTodos();
    }

    @GetMapping("/{sku}")
    public List<ImagenProducto> listarPorProducto(@PathVariable Long sku) {
        return imagenProductoService.obtenerImagenPorIdProducto(sku);
    }

    @DeleteMapping("/producto/{sku}")
    public ResponseEntity<Void> eliminarPorProducto(@PathVariable Long sku) {
        imagenProductoService.deleteByProductoSku(sku);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<ImagenProducto> crear(@RequestBody ImagenProducto img) {
        ImagenProducto creado = imagenProductoService.guardarImagen(img);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> borrar(@PathVariable Long sku) {
        imagenProductoService.borrarImagen(sku);
        return ResponseEntity.noContent().build();
    }
}