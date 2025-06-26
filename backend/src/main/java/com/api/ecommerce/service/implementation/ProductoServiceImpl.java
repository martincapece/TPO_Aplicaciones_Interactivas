package com.api.ecommerce.service.implementation;

import com.api.ecommerce.exceptions.ProductoNoEliminableException;
import com.api.ecommerce.model.Producto;
import com.api.ecommerce.repository.ProductoRepository;
import com.api.ecommerce.service.ProductoService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.api.ecommerce.exceptions.ProductoNoEncontradoException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public Producto obtenerProductoPorSku(Long sku) {
        if (sku == null) {
            throw new IllegalArgumentException("SKU no puede ser null");
        }
        return repo.findById(sku)
                .orElseThrow(() -> new ProductoNoEncontradoException(sku));
    }

    @Override
    @Transactional
    public Producto guardarProducto(Producto p) {
        return repo.save(p);
    }

    @Override
    @Transactional
    public void borrarProducto(Long sku) {
        if (sku == null) {
            throw new IllegalArgumentException("SKU no puede ser null");
        }

        if (!repo.existsById(sku)) {
            throw new ProductoNoEliminableException(sku);
        }

        repo.deleteById(sku);
    }

    @Override
    @Transactional
    public Producto actualizarProducto(Long sku, Map<String, Object> updates) {
        if (sku == null) {
            throw new IllegalArgumentException("SKU no puede ser null");
        }

        Producto producto = repo.findById(sku)
                .orElseThrow(() -> new ProductoNoEncontradoException(sku));

        // Actualizar campos específicos
        if (updates.containsKey("destacado")) {
            producto.setDestacado((Boolean) updates.get("destacado"));
        }
        if (updates.containsKey("nuevo")) {
            producto.setNuevo((Boolean) updates.get("nuevo"));
        }
        if (updates.containsKey("modelo")) {
            producto.setModelo((String) updates.get("modelo"));
        }
        if (updates.containsKey("marca")) {
            producto.setMarca((String) updates.get("marca"));
        }
        if (updates.containsKey("color")) {
            producto.setColor((String) updates.get("color"));
        }
        if (updates.containsKey("precio")) {
            producto.setPrecio(((Number) updates.get("precio")).doubleValue());
        }
        if (updates.containsKey("descripcion")) {
            producto.setDescripcion((String) updates.get("descripcion"));
        }

        return repo.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> filtrarProducto(
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