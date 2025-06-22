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
import java.net.InetAddress;
import java.util.regex.Pattern;
import com.api.ecommerce.exceptions.EmailInvalidoException;
import com.api.ecommerce.exceptions.DominioEmailInvalidoException;
import com.api.ecommerce.exceptions.NombreCompletoInvalidoException;
import com.api.ecommerce.exceptions.UsuarioYaExisteException;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    
    private static final Pattern NOMBRE_COMPLETO_PATTERN = Pattern.compile(
        "^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+\\s+[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$"
    );

    public String register(RegisterRequestDTO registerRequestDTO) {
        if (registerRequestDTO == null) {
            throw new IllegalArgumentException("Request cannot be null");
        }

        // Validaciones básicas de campos vacíos
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

        // Validar nombre completo (que tenga al menos nombre y apellido)
        validarNombreCompleto(registerRequestDTO.nombreCompleto());
        
        // Validar formato de email
        validarFormatoEmail(registerRequestDTO.mail());
        
        // Validar dominio de email
        validarDominioEmail(registerRequestDTO.mail());

        // Validar si el usuario ya existe
        if (clienteRepository.existsByMail(registerRequestDTO.mail())) {
            throw new UsuarioYaExisteException(registerRequestDTO.mail());
        }

        // A partir del DTO construye un cliente
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

    private void validarNombreCompleto(String nombreCompleto) {
        String nombreLimpio = nombreCompleto.trim();
        
        // Verificar que tenga al menos un espacio (nombre y apellido)
        if (!nombreLimpio.contains(" ")) {
            throw new NombreCompletoInvalidoException("Debe ingresar al menos nombre y apellido separados por un espacio");
        }
        
        // Verificar que no sean solo espacios
        if (nombreLimpio.replaceAll("\\s+", " ").split(" ").length < 2) {
            throw new NombreCompletoInvalidoException();
        }
        
        // Verificar que contenga solo letras y espacios
        if (!NOMBRE_COMPLETO_PATTERN.matcher(nombreLimpio).matches()) {
            throw new NombreCompletoInvalidoException("El nombre completo debe contener solo letras y espacios");
        }
        
        // Verificar longitud mínima y máxima
        if (nombreLimpio.length() < 4 || nombreLimpio.length() > 100) {
            throw new NombreCompletoInvalidoException("El nombre completo debe tener entre 4 y 100 caracteres");
        }
    }

    private void validarFormatoEmail(String email) {
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new EmailInvalidoException(email);
        }
    }

    private void validarDominioEmail(String email) {
        try {
            String dominio = email.substring(email.indexOf("@") + 1);
            
            // Verificar que el dominio tenga registros MX o A
            InetAddress.getByName(dominio);
            
        } catch (Exception e) {
            String dominio = email.substring(email.indexOf("@") + 1);
            throw new DominioEmailInvalidoException(dominio);
        }
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