package com.api.ecommerce.security;

import com.api.ecommerce.repository.ClienteRepository;
import com.api.ecommerce.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.www.BasicAuthenticationEntryPoint;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.core.AuthenticationException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final ClienteRepository clienteRepository;
    private final JwtFilter jwtFilter;

    @Autowired
    public SecurityConfig(ClienteRepository clienteRepository, JwtFilter jwtFilter) {
        this.clienteRepository = clienteRepository;
        this.jwtFilter = jwtFilter;
    }

    // Cargar los datos del usuario desde tu sistema a través de UsuarioRepository
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> clienteRepository.findByMail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }


    // Recibe las credenciales del usuario (a través del UsernamePasswordAuthenticationToken)
    // Usa el UserDetailsService para buscar el usuario en la base de datos
    // Usa el PasswordEncoder para verificar si la contraseña proporcionada coincide con la almacenada
    // Si to_do es correcto, crea un token de autenticación; si no, lanza una excepción
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    // Configura el gestor de autenticación que Spring Security utilizará
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // Define el codificador de contraseñas que se usará para encriptar y verificar passwords
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return new AuthenticationEntryPoint() {
            @Override
            public void commence(HttpServletRequest request, HttpServletResponse response,
                               AuthenticationException authException) throws IOException {
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType("application/json");
                response.getWriter().write(String.format(
                    "{\"timestamp\":\"%s\",\"status\":401,\"error\":\"Authentication Error\"," +
                    "\"message\":\"Credenciales inválidas. Por favor, verifique su email y contraseña.\"," +
                    "\"path\":\"%s\"}",
                    java.time.LocalDateTime.now(),
                    request.getRequestURI()
                ));
            }
        };
    }

    // Configura las reglas de seguridad para las diferentes rutas de la API
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new org.springframework.web.cors.CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("http://localhost:5173")); // tu frontend
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exception -> exception
                    .authenticationEntryPoint(authenticationEntryPoint())
                )
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas que no requieren autenticación
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/sapah/productos/**").permitAll()

                        // Rutas que requieren autenticación para modificar productos
                        .requestMatchers(HttpMethod.POST, "/api/productos").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").authenticated()

                        // Rutas exclusivas para administradores
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/imagenes/**").hasRole("ADMIN")
                        .requestMatchers("/sapah/compras/**").hasRole("ADMIN")

                        // Rutas de pedidos solo para usuarios autenticados
                        .requestMatchers("/api/pedidos/**").authenticated()

                        // Cualquier otra ruta requiere autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}