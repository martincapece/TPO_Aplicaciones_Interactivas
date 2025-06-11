package com.api.ecommerce.controller;

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

    private final ImagenProductoService service;

    @GetMapping("/productos/{sku}")
    public List<ImagenProducto> listarPorProducto(@PathVariable Long sku) {
        return service.obtenerPorProducto(sku);
    }

    @PostMapping
    public ResponseEntity<ImagenProducto> crear(@RequestBody ImagenProducto img) {
        ImagenProducto creado = service.crearImagen(img);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        service.eliminarImagen(id);
        return ResponseEntity.noContent().build();
    }
}