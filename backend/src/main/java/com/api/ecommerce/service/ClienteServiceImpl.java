package com.api.ecommerce.service;

import com.api.ecommerce.model.Cliente;
import java.util.List;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.repository.ClienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // INYECTA EL ENCODER

    @Override
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public Cliente guardarCliente(Cliente cliente) {
        // Hashea la contraseña antes de guardar
        if (cliente.getContraseña() != null && !cliente.getContraseña().isBlank()) {
            cliente.setContraseña(passwordEncoder.encode(cliente.getContraseña()));
        }
        return clienteRepository.save(cliente);
    }

    @Override
    public void borrarCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    @Override
    public Cliente actualizarRolCliente(Long id, Role nuevoRol) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        cliente.setRole(nuevoRol);
        return clienteRepository.save(cliente);
    }
}