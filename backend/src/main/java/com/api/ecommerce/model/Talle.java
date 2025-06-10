package com.api.ecommerce.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "talle")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Talle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_talle")
    private Long idTalle;

    @Column(name = "numero", length = 10, nullable = false)
    private String numero;
}