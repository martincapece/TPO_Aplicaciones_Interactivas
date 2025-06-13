package com.api.ecommerce.service;

import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
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
}