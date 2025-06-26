package com.api.ecommerce.service;

import com.api.ecommerce.dto.AuthenticationRequestDTO;
import com.api.ecommerce.dto.AuthenticationResponseDTO;
import com.api.ecommerce.dto.RegisterRequestDTO;

public interface AuthenticationService {
    String register(RegisterRequestDTO registerRequestDTO);
    AuthenticationResponseDTO login(AuthenticationRequestDTO authenticationRequestDTO);
}
