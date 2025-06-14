package com.api.ecommerce.controller;

import com.api.ecommerce.dto.ClienteLoginDTO;
import com.api.ecommerce.dto.ClienteRegisterDTO;
import com.api.ecommerce.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<String> login(@RequestBody ClienteLoginDTO clienteLoginDTO) {
        String jwt = authenticationService.login(clienteLoginDTO);
        return ResponseEntity.ok(jwt);
    }

}
