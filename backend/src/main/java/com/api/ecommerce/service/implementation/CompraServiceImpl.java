package com.api.ecommerce.service.implementation;

import com.api.ecommerce.dto.CompraCompletaDTO;
import com.api.ecommerce.model.Cliente;
import com.api.ecommerce.model.Compra;
import com.api.ecommerce.model.ItemCompra;
import com.api.ecommerce.model.ProductoTalle;
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
    public Compra guardarCompra(Compra compra) {
        return compraRepository.save(compra);
    }

    @Override
    public void borrarCompra(Long id) {
        compraRepository.deleteById(id);
    }

    @Override
    @Transactional
    public Compra crearCompraCompleta(CompraCompletaDTO request) {
        // 1. Buscar el cliente
        Cliente cliente = clienteRepository.findById(request.getIdCliente())
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con ID: " + request.getIdCliente()));

        // 2. Calcular el monto total primero
        double montoTotal = 0.0;
        for (CompraCompletaDTO.ItemCompraDTO itemDTO : request.getItems()) {
            // Verificar que el ProductoTalle existe
            productoTalleRepository.findById(itemDTO.getIdProductoTalle())
                    .orElseThrow(() -> new RuntimeException("ProductoTalle no encontrado con ID: " + itemDTO.getIdProductoTalle()));

            montoTotal += itemDTO.getCantidad() * itemDTO.getPrecioUnitario();
        }

        // 3. Crear la compra con el monto total ya calculado
        Compra compra = new Compra();
        compra.setCliente(cliente);
        compra.setMedioPago(request.getMedioPago());
        compra.setFecha(LocalDateTime.now());
        compra.setPrecioFinal(montoTotal); // Establecer el monto correcto desde el inicio

        // 4. Crear los items
        List<ItemCompra> items = new ArrayList<>();
        for (CompraCompletaDTO.ItemCompraDTO itemDTO : request.getItems()) {
            ProductoTalle productoTalle = productoTalleRepository.findById(itemDTO.getIdProductoTalle())
                    .orElseThrow(() -> new RuntimeException("ProductoTalle no encontrado"));

            ItemCompra item = new ItemCompra();
            item.setCompra(compra);
            item.setProductoTalle(productoTalle);
            item.setCantidad(itemDTO.getCantidad());
            item.setPrecioUnitario(itemDTO.getPrecioUnitario());

            items.add(item);
        }

        // 5. Asignar los items a la compra
        compra.setItems(items);

        // 6. Guardar todo junto (cascade se encarga de los items)
        return compraRepository.save(compra);
    }


}
