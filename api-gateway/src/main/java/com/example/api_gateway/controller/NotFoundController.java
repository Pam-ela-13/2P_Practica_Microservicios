package com.example.api_gateway.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class NotFoundController {

    @GetMapping("/not-found")
    public Map<String, Object> notFound() {
        return Map.of(
            "status", 404,
            "error", "No encontrado",
            "mensaje", "La API no tiene esa ruta"
        );
    }
}