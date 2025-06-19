package com.api.ecommerce.dto;

import java.io.Serializable;

public record AuthenticationResponseDTO(
        String jwt

)  implements Serializable {}
