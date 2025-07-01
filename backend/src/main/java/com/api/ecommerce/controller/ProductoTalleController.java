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

    /** Descontar stock. */
    @PutMapping("/descontar-stock")
    public ResponseEntity<?> descontarStock(
            @RequestParam Long sku,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidad) {
        ProductoTalle pt = productoTalleService.getProductoTalle(sku, idTalle);
        if (pt == null) {
            return ResponseEntity.badRequest().body("Producto y talle no encontrados.");
        }
        if (cantidad == null || cantidad <= 0) {
            return ResponseEntity.badRequest().body("La cantidad a restar debe ser mayor a cero.");
        }
        if (pt.getStock() < cantidad) {
            return ResponseEntity.badRequest().body("Stock insuficiente. Disponible: " + pt.getStock());
        }
        productoTalleService.descontarStock(sku, idTalle, cantidad);

        // Volvemos a buscar el stock actualizado (opcional, o sumá/restá vos en el objeto)
        ProductoTalle actualizado = productoTalleService.getProductoTalle(sku, idTalle);
        return ResponseEntity.ok("Stock actualizado. Nuevo stock: " + actualizado.getStock());
    }

    /** Descontar stock. */
    @PutMapping("/agregar-stock")
    public ResponseEntity<?> agregarStock(
            @RequestParam Long sku,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidad) {
        ProductoTalle pt = productoTalleService.getProductoTalle(sku, idTalle);
        if (pt == null) {
            return ResponseEntity.badRequest().body("Producto y talle no encontrados.");
        }
        if (cantidad == null || cantidad <= 0) {
            return ResponseEntity.badRequest().body("La cantidad a agregar debe ser mayor a cero.");
        }
        productoTalleService.agregarStock(sku, idTalle, cantidad);

        // Volvemos a buscar el stock actualizado (opcional, o sumá/restá vos en el objeto)
        ProductoTalle actualizado = productoTalleService.getProductoTalle(sku, idTalle);
        return ResponseEntity.ok("Stock actualizado. Nuevo stock: " + actualizado.getStock());
    }
    
    /** Setear stock exacto (crear si no existe) */
    @PutMapping("/actualizar-stock")
    public ResponseEntity<?> actualizarStock(
            @RequestParam Long sku,
            @RequestParam Long idTalle,
            @RequestParam Integer cantidad) {
        if (cantidad == null || cantidad < 0) {
            return ResponseEntity.badRequest().body("La cantidad debe ser 0 o mayor.");
        }
        ProductoTalle pt = productoTalleService.actualizarStock(sku, idTalle, cantidad);
        return ResponseEntity.ok(pt);
    }

}
