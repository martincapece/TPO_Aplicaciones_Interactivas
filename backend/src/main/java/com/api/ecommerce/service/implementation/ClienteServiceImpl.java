package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.Cliente;
import java.util.List;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.service.ClienteService;
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

    @Override
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }

    @Override
    public Cliente obtenerClientePorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
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