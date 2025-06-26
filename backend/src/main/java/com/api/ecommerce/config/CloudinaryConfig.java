package com.api.ecommerce.config;

import com.cloudinary.Cloudinary;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ConfigurationProperties(prefix = "cloudinary")
@Data
public class CloudinaryConfig {
    
    private String cloudName;
    private String apiKey;
    private String apiSecret;
    private String folder;
    private long maxFileSize;
    private boolean secure = true;
    
    @Bean
    public Cloudinary cloudinary() {
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", secure);
        
        return new Cloudinary(config);
    }
}