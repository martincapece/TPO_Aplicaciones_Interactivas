package com.api.ecommerce.controller;

import com.api.ecommerce.dto.ClienteLoginDTO;
import com.api.ecommerce.dto.ClienteRegisterDTO;
import com.api.ecommerce.exceptions.AuthenticationException;
import com.api.ecommerce.service.AuthenticationService;
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
    public ResponseEntity<String> register(@RequestBody ClienteRegisterDTO clienteRegisterDTO) {
        return ResponseEntity.ok(authenticationService.register(clienteRegisterDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody ClienteLoginDTO clienteLoginDTO) {
        try {
            String jwt = authenticationService.login(clienteLoginDTO);
            return ResponseEntity.ok(jwt);
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
