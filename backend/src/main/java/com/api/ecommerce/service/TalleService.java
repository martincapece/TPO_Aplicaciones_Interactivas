package com.api.ecommerce.service;

import com.api.ecommerce.model.Talle;
import java.util.List;

public interface TalleService {
    List<Talle> obtenerTodos();
    Talle obtenerPorId(Long id);
    Talle crearTalle(Talle t);
    void eliminarTalle(Long id);
}
