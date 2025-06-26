package com.api.ecommerce.service.implementation;

import com.api.ecommerce.dto.CompraCompletaDTO;
import com.api.ecommerce.dto.CompraRequestDTO;
import com.api.ecommerce.dto.ItemCompraRequestDTO;
import com.api.ecommerce.model.*;
import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.repository.CompraRepository;
import com.api.ecommerce.repository.ProductoTalleRepository;
import com.api.ecommerce.service.CompraService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CompraServiceImpl implements CompraService {

    @Autowired
    private CompraRepository compraRepository;
    @Autowired
    private ClienteRepository clienteRepository;
    @Autowired
    private ProductoTalleRepository productoTalleRepository;

    @Override
    public List<Compra> obtenerTodos() {
        return compraRepository.findAll();
    }

    @Override
    public Compra obtenerCompraPorId(Long id) {
        return compraRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public Compra guardarCompra(CompraRequestDTO compraRequest) {
        Cliente cliente = clienteRepository.findById(compraRequest.idCliente()).
                orElseThrow(() -> new NoSuchElementException("Cliente con ID " + compraRequest.idCliente() + " no encontrado"));

        Compra compra = new Compra();
        compra.setFecha(LocalDateTime.now());
        compra.setMedioPago(compraRequest.medioPago());
        compra.setCliente(cliente);

        List<ItemCompra> items = new ArrayList<>();
        double total = 0;

        for (ItemCompraRequestDTO itemDTO : compraRequest.items()) {
            ProductoTalle productoTalle = productoTalleRepository.findByProducto_SkuAndTalle_Numero(itemDTO.sku(), itemDTO.talle())
                    .orElseThrow(() -> new NoSuchElementException("Producto no encontrado con sku: " + itemDTO.sku() + " y talle: " + itemDTO.talle()));

            if (productoTalle.getStock() < itemDTO.cantidad()) {
                throw new NoSuchElementException("No hay stock suficiente para el producto con SKU: " + productoTalle.getProducto().getSku());
            }

            productoTalle.setStock(productoTalle.getStock() - itemDTO.cantidad());
            productoTalleRepository.save(productoTalle);

            ItemCompra itemCompra = new ItemCompra();
            itemCompra.setProductoTalle(productoTalle);
            itemCompra.setCantidad(itemDTO.cantidad());
            itemCompra.setCompra(compra);

            items.add(itemCompra);
            total += itemCompra.getSubtotal();
        }

        compra.setItems(items);
        compra.setPrecioFinal(total);
        return compraRepository.save(compra);
    }

    @Override
    public void borrarCompra(Long id) {
        compraRepository.deleteById(id);
    }


}
