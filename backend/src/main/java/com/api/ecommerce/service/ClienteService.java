package com.api.ecommerce.service;

import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Role;

import java.util.List;

public interface ClienteService {
    List<Cliente> obtenerTodos();
    Cliente obtenerClientePorId(Long id);
    Cliente guardarCliente(Cliente cliente);
    void borrarCliente(Long id);
    Cliente actualizarRolCliente(Long id, Role nuevoRol);
}
