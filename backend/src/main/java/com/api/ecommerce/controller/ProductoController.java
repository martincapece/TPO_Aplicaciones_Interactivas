package com.api.ecommerce.controller;

import com.api.ecommerce.model.Producto;
import com.api.ecommerce.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/sapah/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService service;

    @GetMapping
    public List<Producto> listarTodos() {
        return service.obtenerTodos();
    }

    @GetMapping("/{sku}")
    public Producto obtenerUno(@PathVariable String sku) {
        return service.obtenerPorSku(sku);
    }

    @PostMapping
    public ResponseEntity<Producto> crear(@RequestBody Producto p) {
        Producto creado = service.crearProducto(p);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> borrar(@PathVariable String sku) {
        service.eliminarProducto(sku);
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
        return service.filtrar(marca, modelo, color, minPrecio, maxPrecio, destacados, nuevos);
    }
}