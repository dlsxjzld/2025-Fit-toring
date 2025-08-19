package fittoring.aspect.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public record ErrorLog(
        String event,
        String traceId,
        Long durationMs,
        String method,
        String uri,
        String errorType,
        String message,
        String stack,
        String normalizedUri,
        Integer statusCode,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss.SSS")
        LocalDateTime timestamp
) {
}
