package com.api.ecommerce.controller;

import com.api.ecommerce.dto.CompraCompletaDTO;
import com.api.ecommerce.dto.CompraDTO;
import com.api.ecommerce.dto.CompraRequestDTO;
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
    public List<CompraDTO> listar() {
        return compraService.obtenerTodosDTO();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Compra> obtenerPorId(@PathVariable Long id) {
        Compra compra = compraService.obtenerCompraPorId(id);
        return compra != null ? ResponseEntity.ok(compra) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Compra> crear(@RequestBody CompraRequestDTO compra) {
        Compra creado = compraService.guardarCompra(compra);
        return ResponseEntity.created(null).body(creado);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        compraService.borrarCompra(id);
        return ResponseEntity.noContent().build();
    }
}
