package com.api.ecommerce.service;

import com.api.ecommerce.model.Producto;
import com.api.ecommerce.repository.ProductoRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<Producto> obtenerTodos() {
        return repo.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Producto obtenerPorSku(String sku) {
        return repo.findById(sku)
                .orElseThrow(() -> new IllegalArgumentException("Producto con SKU " + sku + " no encontrado"));
    }

    @Override
    @Transactional
    public Producto crearProducto(Producto p) {
        if (repo.existsById(p.getSku())) {
            throw new IllegalArgumentException("El SKU ya existe: " + p.getSku());
        }
        return repo.save(p);
    }

    @Override
    @Transactional
    public void eliminarProducto(String sku) {
        if (!repo.existsById(sku)) {
            throw new IllegalArgumentException("No existe producto con SKU " + sku);
        }
        repo.deleteById(sku);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> filtrar(
            String marca,
            String modelo,
            String color,
            BigDecimal minPrecio,
            BigDecimal maxPrecio,
            Boolean destacados,
            Boolean nuevos
    ) {
        Specification<Producto> spec = (root, query, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            if (marca != null) {
                preds.add(cb.equal(cb.lower(root.get("marca")), marca.toLowerCase()));
            }
            if (modelo != null) {
                preds.add(cb.equal(cb.lower(root.get("modelo")), modelo.toLowerCase()));
            }
            if (color != null) {
                preds.add(cb.equal(cb.lower(root.get("color")), color.toLowerCase()));
            }
            if (minPrecio != null && maxPrecio != null) {
                preds.add(cb.between(root.get("precio"), minPrecio, maxPrecio));
            } else if (minPrecio != null) {
                preds.add(cb.greaterThanOrEqualTo(root.get("precio"), minPrecio));
            } else if (maxPrecio != null) {
                preds.add(cb.lessThanOrEqualTo(root.get("precio"), maxPrecio));
            }
            if (destacados != null) {
                preds.add(cb.equal(root.get("destacado"), destacados));
            }
            if (nuevos != null) {
                preds.add(cb.equal(root.get("nuevo"), nuevos));
            }

            return cb.and(preds.toArray(new Predicate[0]));
        };
        return repo.findAll(spec);
    }
}