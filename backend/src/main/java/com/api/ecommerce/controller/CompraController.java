package com.api.ecommerce.controller;

import com.api.ecommerce.dto.CompraCompletaDTO;
import com.api.ecommerce.model.Compra;
import com.api.ecommerce.service.CompraService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sapah/compras")
@RequiredArgsConstructor
public class CompraController {

    @Autowired
    private final CompraService compraService;

    @GetMapping
    public List<Compra> listar() {
        return compraService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra> obtenerPorId(@PathVariable Long id) {
        Compra compra = compraService.obtenerCompraPorId(id);
        return compra != null ? ResponseEntity.ok(compra) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Compra> crear(@RequestBody Compra compra) {
        Compra creado = compraService.guardarCompra(compra);
        return ResponseEntity.created(null).body(creado);
    }

    @PostMapping("/completa")
    public ResponseEntity<Compra> crearCompraCompleta(@RequestBody CompraCompletaDTO request) {
        try {
            Compra compra = compraService.crearCompraCompleta(request);
            return ResponseEntity.ok(compra);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        compraService.borrarCompra(id);
        return ResponseEntity.noContent().build();
    }
}
