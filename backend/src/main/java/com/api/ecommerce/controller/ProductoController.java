package com.api.ecommerce.controller;

import com.api.ecommerce.model.Producto;
import com.api.ecommerce.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sapah/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public List<Producto> listarTodos() {
        return productoService.obtenerTodos();
    }

    @GetMapping("/{sku}")
    public Producto obtenerUno(@PathVariable Long sku) {
        return productoService.obtenerProductoPorSku(sku);
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto p) {
        Producto creado = productoService.guardarProducto(p);
        return ResponseEntity.created(null).body(creado);
    }

    @PatchMapping("/{sku}")
    public ResponseEntity<Producto> actualizar(@PathVariable Long sku, @RequestBody Map<String, Object> updates) {
        Producto actualizado = productoService.actualizarProducto(sku, updates);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> borrar(@PathVariable Long sku) {
        productoService.borrarProducto(sku);
        return ResponseEntity.noContent().build();
    }

    /** Endpoint único para filtros combinables */
    @GetMapping("/filter")
    public List<Producto> filtrar(
            @RequestParam(required = false) String marca,
            @RequestParam(required = false) String modelo,
            @RequestParam(required = false) String color,
            @RequestParam(required = false) BigDecimal minPrecio,
            @RequestParam(required = false) BigDecimal maxPrecio,
            @RequestParam(required = false) Boolean destacados,
            @RequestParam(required = false) Boolean nuevos
    ) {
        return productoService.filtrarProducto(marca, modelo, color, minPrecio, maxPrecio, destacados, nuevos);
    }

    /** Creacion masiva de productos */
    @PostMapping("/bulk")
    public ResponseEntity<List<Producto>> crearProductos(@RequestBody List<Producto> productos) {
        List<Producto> creados = productos.stream()
                .map(productoService::guardarProducto)
                .toList();
        return ResponseEntity.ok(creados);
    }
}