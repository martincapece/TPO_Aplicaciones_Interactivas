package com.api.ecommerce.service;

import com.api.ecommerce.model.Talle;
import com.api.ecommerce.repository.TalleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TalleServiceImpl implements TalleService {

    private final TalleRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<Talle> obtenerTodos() {
        return repo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Talle obtenerPorId(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Talle con ID " + id + " no encontrado"));
    }

    @Override
    @Transactional
    public Talle crearTalle(Talle t) {
        return repo.save(t);
    }

    @Override
    @Transactional
    public void eliminarTalle(Long id) {
        if (!repo.existsById(id)) {
            throw new IllegalArgumentException("No existe talle con ID " + id);
        }
        repo.deleteById(id);
    }
}