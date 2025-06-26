package com.api.ecommerce.service;

import com.api.ecommerce.dto.CrearTalleRequestDTO;
import com.api.ecommerce.model.Talle;
import java.util.List;

public interface TalleService {
    List<Talle> obtenerTodos();
    Talle obtenerTallePorId(Long id);
    Talle guardarTalle(CrearTalleRequestDTO t);
    void borrarTalle(Long id);
}
