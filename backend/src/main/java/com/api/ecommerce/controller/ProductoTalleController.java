package com.api.ecommerce.controller;

import com.api.ecommerce.model.ProductoTalle;
import com.api.ecommerce.service.ProductoTalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sapah/productos-talles")
@RequiredArgsConstructor
public class ProductoTalleController {

    private final ProductoTalleService productoTalleService;

    @GetMapping
    public List<ProductoTalle> listarPorProducto() {
        return productoTalleService.obtenerTodos();
    }

    @GetMapping("/{sku}")
    public List<ProductoTalle> listarPorProducto(@PathVariable Long sku) {
        return productoTalleService.obtenerPorSku(sku);
    }

    @PostMapping
    public ResponseEntity<ProductoTalle> crear(@RequestBody ProductoTalle productoTalle) {
        ProductoTalle creado = productoTalleService.guardarProductoTalle(productoTalle);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        productoTalleService.borrarProductoTalle(id);
        return ResponseEntity.noContent().build();
    }

    /** Carga masiva de ProductoTalle */
    @PostMapping("/bulk")
    public ResponseEntity<List<ProductoTalle>> crearProductoTalles(@RequestBody List<ProductoTalle> productoTalles) {
        List<ProductoTalle> creados = productoTalles.stream()
                .map(productoTalleService::guardarProductoTalle)
                .toList();
        return ResponseEntity.ok(creados);
    }
}
