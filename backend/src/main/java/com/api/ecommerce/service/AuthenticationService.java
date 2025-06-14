package com.api.ecommerce.service;

import com.api.ecommerce.dto.ClienteLoginDTO;
import com.api.ecommerce.dto.ClienteRegisterDTO;
import com.api.ecommerce.exceptions.AuthenticationException;
import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.security.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public String register(ClienteRegisterDTO clienteRegisterDTO) {
        if (clienteRegisterDTO == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (!StringUtils.hasText(clienteRegisterDTO.getMail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (!StringUtils.hasText(clienteRegisterDTO.getContraseña())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        if (!StringUtils.hasText(clienteRegisterDTO.getNombre_completo())) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        if (!StringUtils.hasText(clienteRegisterDTO.getUsuario())) {
            throw new IllegalArgumentException("username cannot be empty");
        }
        //  valida si el mail ya existe
        if (clienteRepository.existsByMail(clienteRegisterDTO.getMail())) {
            throw new RuntimeException("Email already exists");
        }

        //  A partir del DTO construye un cliente
        Cliente cliente = Cliente.builder()
                .nombreCompleto(clienteRegisterDTO.getNombre_completo())
                .usuario(clienteRegisterDTO.getUsuario())
                .mail(clienteRegisterDTO.getMail())
                .contraseña(passwordEncoder.encode(clienteRegisterDTO.getContraseña()))
                .role(Role.USER)
                .build();

        clienteRepository.save(cliente);
        return "User registered successfully";
    }

    public String login(ClienteLoginDTO clienteLoginDTO) {
        if (clienteLoginDTO == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (!StringUtils.hasText(clienteLoginDTO.getMail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (!StringUtils.hasText(clienteLoginDTO.getContraseña())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // Primero verificamos si el usuario existe
        Cliente cliente = clienteRepository.findByMail(clienteLoginDTO.getMail())
                .orElseThrow(() -> new AuthenticationException("Usuario no encontrado"));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            clienteLoginDTO.getMail(),
                            clienteLoginDTO.getContraseña()));

            // Generar el token JWT
            return jwtUtil.generateToken(cliente.getMail(), cliente.getRole());
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Credenciales inválidas. Por favor, verifique su email y contraseña.");
        }
    }
}
