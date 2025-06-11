package com.api.ecommerce.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "cliente")
@Data
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_cliente;

    @Column(name = "nombre_completo", nullable = false)
    private String nombre_completo;

    @Column(name = "usuario", nullable = false, unique = true)
    private String usuario;

    @Column(name = "mail", nullable = false, unique = true)
    private String mail;

    @Column(name = "contraseña", nullable = false)
    private String contraseña;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Compra> compras;
}
