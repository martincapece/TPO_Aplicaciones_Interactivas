package com.api.ecommerce.service.implementation;

import com.api.ecommerce.dto.AuthenticationRequestDTO;
import com.api.ecommerce.dto.AuthenticationResponseDTO;
import com.api.ecommerce.dto.RegisterRequestDTO;
import com.api.ecommerce.exceptions.AuthenticationException;
import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Role;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.security.JwtUtil;
import com.api.ecommerce.service.AuthenticationService;
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
public class AuthenticationServiceImpl implements AuthenticationService {
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public String register(RegisterRequestDTO registerRequestDTO) {
        if (registerRequestDTO == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (!StringUtils.hasText(registerRequestDTO.mail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (!StringUtils.hasText(registerRequestDTO.contraseña())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        if (!StringUtils.hasText(registerRequestDTO.nombreCompleto())) {
            throw new IllegalArgumentException("Name cannot be empty");
        }

        if (!StringUtils.hasText(registerRequestDTO.usuario())) {
            throw new IllegalArgumentException("username cannot be empty");
        }
        //  valida si el mail ya existe
        if (clienteRepository.existsByMail(registerRequestDTO.mail())) {
            throw new RuntimeException("Email already exists");
        }

        //  A partir del DTO construye un cliente
        Cliente cliente = Cliente.builder()
                .nombreCompleto(registerRequestDTO.nombreCompleto())
                .usuario(registerRequestDTO.usuario())
                .mail(registerRequestDTO.mail())
                .contraseña(passwordEncoder.encode(registerRequestDTO.contraseña()))
                .role(Role.USER)
                .build();

        clienteRepository.save(cliente);
        return "User registered successfully";
    }

    public AuthenticationResponseDTO login(AuthenticationRequestDTO authenticationRequestDTO) {
        if (authenticationRequestDTO == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        if (!StringUtils.hasText(authenticationRequestDTO.mail())) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        if (!StringUtils.hasText(authenticationRequestDTO.contraseña())) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        // Primero verificamos si el usuario existe
        Cliente cliente = clienteRepository.findByMail(authenticationRequestDTO.mail())
                .orElseThrow(() -> new AuthenticationException("Usuario no encontrado"));

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequestDTO.mail(),
                            authenticationRequestDTO.contraseña()));

            // Generar el token JWT
            return new AuthenticationResponseDTO(jwtUtil.generateToken(cliente.getMail(), cliente.getRole()));
        } catch (BadCredentialsException e) {
            throw new AuthenticationException("Credenciales inválidas. Por favor, verifique su email y contraseña.");
        }
    }
}
