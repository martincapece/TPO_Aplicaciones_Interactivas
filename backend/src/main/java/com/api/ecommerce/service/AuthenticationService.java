package com.api.ecommerce.service;

import com.api.ecommerce.dto.ClienteRegisterDTO;
import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.repository.ClienteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public String register(ClienteRegisterDTO clienteRegisterDTO) {
        if (clienteRepository.existsByMail(clienteRegisterDTO.getMail())) {
            throw new RuntimeException("Email already exists");
        }

        Cliente cliente = Cliente.builder()
                .nombre_completo(clienteRegisterDTO.getNombre_completo())
                .usuario(clienteRegisterDTO.getUsuario())
                .mail(clienteRegisterDTO.getMail())
                .contraseña(passwordEncoder.encode(clienteRegisterDTO.getContraseña()))
                .role(Role.USER)
                .build();

        clienteRepository.save(cliente);
        return "User registered successfully";
    }

    public String login(ClienteRegisterDTO clienteRegisterDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        clienteRegisterDTO.getMail(),
                        clienteRegisterDTO.getContraseña()));

        return "Login successful";
    }
}
