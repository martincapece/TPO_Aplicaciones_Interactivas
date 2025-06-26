package com.api.ecommerce.controller;

import com.api.ecommerce.dto.AuthenticationRequestDTO;
import com.api.ecommerce.dto.AuthenticationResponseDTO;
import com.api.ecommerce.dto.RegisterRequestDTO;
import com.api.ecommerce.exceptions.AuthenticationException;
import com.api.ecommerce.service.AuthenticationService;
import com.api.ecommerce.service.implementation.AuthenticationServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok(authenticationService.register(registerRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequestDTO authenticationRequestDTO) {
        try {
            AuthenticationResponseDTO response = authenticationService.login(authenticationRequestDTO);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException | BadCredentialsException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("timestamp", LocalDateTime.now());
            error.put("status", HttpStatus.UNAUTHORIZED.value());
            error.put("error", "Authentication Error");
            error.put("message", "Credenciales inválidas. Por favor, verifique su email y contraseña.");
            error.put("path", "/api/auth/login");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }
}
