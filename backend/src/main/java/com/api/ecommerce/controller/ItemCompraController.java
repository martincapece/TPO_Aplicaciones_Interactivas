package com.api.ecommerce.controller;

import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.ItemCompra;
import com.api.ecommerce.service.ItemCompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sapah/items-compra")
@RequiredArgsConstructor
public class ItemCompraController {

    private final ItemCompraService itemCompraService;

    @GetMapping
    public List<ItemCompra> listar() {
        return itemCompraService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemCompra> obtenerPorId(@PathVariable Long id) {
        ItemCompra itemCompra = itemCompraService.obtenerItemCompraPorId(id);
        return itemCompra != null ? ResponseEntity.ok(itemCompra) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ItemCompra> crear(@RequestBody ItemCompra itemCompra) {
        ItemCompra creado = itemCompraService.guardarItemCompra(itemCompra);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        itemCompraService.borrarItemCompra(id);
        return ResponseEntity.noContent().build();
    }
}
