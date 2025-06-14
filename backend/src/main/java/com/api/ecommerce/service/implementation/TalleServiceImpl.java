package com.api.ecommerce.service.implementation;

import com.api.ecommerce.model.Talle;
import com.api.ecommerce.repository.TalleRepository;
import com.api.ecommerce.service.TalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TalleServiceImpl implements TalleService {

    private final TalleRepository talleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Talle> obtenerTodos() {
        return talleRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Talle obtenerTallePorId(Long id) {
        return talleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Talle con ID " + id + " no encontrado"));
    }

    @Override
    @Transactional
    public Talle guardarTalle(Talle t) {
        return talleRepository.save(t);
    }

    @Override
    @Transactional
    public void borrarTalle(Long id) {
        if (!talleRepository.existsById(id)) {
            throw new IllegalArgumentException("No existe talle con ID " + id);
        }
        talleRepository.deleteById(id);
    }
}