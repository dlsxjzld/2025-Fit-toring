package fittoring.aspect.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record ResponseLog(
        String event,
        String traceId,
        Long durationMs,
        String method,
        String uri,
        Integer statusCode,
        JsonNode body
) {
}
