package com.api.ecommerce.controller;

import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final ClienteService clienteService;

    @Autowired
    public AdminController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    //  Actualiza el Rol de un cliente
    // Ej: PUT /api/admin/usuarios/{userId}/role?newRole=ADMIN

    @PutMapping("/clientes/{id}/{rol}")
    public ResponseEntity<Cliente> actualizarRolCliente(@PathVariable Long id, @PathVariable Role rol) {
        Cliente clienteActualizado = clienteService.actualizarRolCliente(id, rol);
        return ResponseEntity.ok(clienteActualizado);
    }


    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.borrarCliente(id);
        return ResponseEntity.noContent().build();
    }
}
