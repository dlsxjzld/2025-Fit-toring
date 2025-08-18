package fittoring.aspect.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record RequestLog(
        String event,
        String traceId,
        Long durationMs,
        String method,
        String uri,
        String queryString,
        String clientIp,
        String userAgent,
        JsonNode body
) {
}
