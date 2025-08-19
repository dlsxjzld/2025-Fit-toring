package fittoring.aspect.dto;

public record ErrorLog(
        String event,
        String traceId,
        Long durationMs,
        String method,
        String uri,
        String errorType,
        String message,
        String stack,
        String normalizedUri
) {
}
