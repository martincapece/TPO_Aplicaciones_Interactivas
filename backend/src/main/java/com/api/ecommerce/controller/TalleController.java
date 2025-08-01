package com.api.ecommerce.controller;

import com.api.ecommerce.dto.CrearTalleRequestDTO;
import com.api.ecommerce.model.Talle;
import com.api.ecommerce.service.TalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sapah/talles")
@RequiredArgsConstructor
public class TalleController {

    private final TalleService talleService;

    @GetMapping
    public List<Talle> listarTodos() {
        return talleService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Talle obtenerUno(@PathVariable Long id) {
        return talleService.obtenerTallePorId(id);
    }

    @PostMapping
    public ResponseEntity<Talle> crear(@RequestBody CrearTalleRequestDTO crearTalleRequestDTO) {
        Talle creado = talleService.guardarTalle(crearTalleRequestDTO);
        return ResponseEntity.created(null).body(creado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        talleService.borrarTalle(id);
        return ResponseEntity.noContent().build();
    }

    /** Creacion masiva de Talles */
    @PostMapping("/bulk")
    public ResponseEntity<List<Talle>> crearTalles(@RequestBody List<CrearTalleRequestDTO> tallesDTOs) {
        List<Talle> creados = tallesDTOs.stream()
                .map(talleService::guardarTalle)
                .toList();
        return ResponseEntity.ok(creados);
    }
}
