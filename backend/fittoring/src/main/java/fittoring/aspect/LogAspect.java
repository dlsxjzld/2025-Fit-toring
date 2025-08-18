package fittoring.aspect;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fittoring.aspect.dto.ErrorLog;
import fittoring.aspect.dto.RequestLog;
import fittoring.aspect.dto.ResponseLog;
import fittoring.util.JsonUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ContentCachingRequestWrapper;

@RequiredArgsConstructor
@Slf4j
@Aspect
@Component
public class LogAspect {

    private static final String START_TIME_NS = "LOG_START_TIME_NS";
    private static final String TRACE_ID = "traceId";
    private static final String METHOD = "method";
    private static final String URI = "uri"; // 필요 시 채우기

    private final ObjectMapper objectMapper;
    private final JsonUtil jsonUtil;

    @Pointcut("execution(* fittoring..*Controller.*(..))")
    public void controller() {
    }

    @Before("controller()")
    public void logBeforeApiCall() {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attrs == null) {
            return;
        }

        HttpServletRequest req = attrs.getRequest();
        MDC.put(TRACE_ID, UUID.randomUUID().toString());
        MDC.put(METHOD, req.getMethod());
        MDC.put(URI, req.getRequestURI());
        req.setAttribute(START_TIME_NS, System.nanoTime());

        if (!logRequestWithBody(attrs)) {
            logRequest(attrs, null);
        }
    }

    private boolean logRequestWithBody(ServletRequestAttributes attrs) {
        HttpServletRequest request = attrs.getRequest();
        if (request instanceof ContentCachingRequestWrapper wrapper) {
            byte[] content = wrapper.getContentAsByteArray();
            if (content.length == 0) {
                try {
                    wrapper.getInputStream().readAllBytes();
                    content = wrapper.getContentAsByteArray();
                } catch (IOException e) {
                    log.warn("요청 바디 읽기 실패", e);
                }
            }
            if (content.length > 0) {
                String rawBody = new String(content, StandardCharsets.UTF_8);
                logRequest(attrs, rawBody);
                return true;
            }
        }
        return false;
    }

    private void logRequest(ServletRequestAttributes attrs, String bodyString) {
        HttpServletRequest req = attrs.getRequest();
        JsonNode rawNode = jsonUtil.toJsonNodeOrNull(bodyString);
        JsonNode maskedNode = rawNode == null ? null : jsonUtil.maskNode(rawNode);

        RequestLog logDto = new RequestLog(
                "REQUEST",
                MDC.get(TRACE_ID),
                null,
                req.getMethod(),
                req.getRequestURI(),
                req.getQueryString(),
                getClientIp(req),
                req.getHeader("User-Agent"),
                maskedNode
        );
        writeJson(logDto);
    }

    @AfterReturning(pointcut = "controller()", returning = "result")
    public void logAfterApiCall(Object result) {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        Long durationMs = calcDuration(attrs);
        String method = MDC.get(METHOD);
        String uri = MDC.get(URI);
        String trace = MDC.get(TRACE_ID);
        int statusCodeValue;
        Object rawBodyObj;

        try {
            if (result instanceof org.springframework.http.ResponseEntity<?> resp) {
                statusCodeValue = resp.getStatusCode().value();
                rawBodyObj = resp.getBody();
            } else {
                statusCodeValue = 200;
                rawBodyObj = result;
            }
            JsonNode rawNode = (rawBodyObj == null)
                    ? null
                    : objectMapper.valueToTree(rawBodyObj);
            JsonNode maskedNode = (rawNode == null) ? null : jsonUtil.maskNode(rawNode);

            ResponseLog logDto = new ResponseLog(
                    "RESPONSE",
                    trace,
                    durationMs,
                    method,
                    uri,
                    statusCodeValue,
                    maskedNode
            );
            writeJson(logDto);
        } catch (Exception e) {
            log.error("RESPONSE 직렬화 실패: {}", result, e);
        } finally {
            MDC.remove(TRACE_ID);
            MDC.remove(METHOD);
            MDC.remove(URI);
        }
    }

    @AfterThrowing(pointcut = "controller()", throwing = "e")
    public void afterThrowingController(Throwable e) {
        ServletRequestAttributes attrs =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        Long durationMs = calcDuration(attrs);

        ErrorLog logDto = new ErrorLog(
                "ERROR",
                MDC.get(TRACE_ID),
                durationMs,
                MDC.get(METHOD),
                MDC.get(URI),
                e.getClass().getName(),
                e.getMessage(),
                stackToOneLine(e)
        );
        writeJson(logDto);
        MDC.remove(TRACE_ID);
        MDC.remove(METHOD);
        MDC.remove(URI);
    }

    private void writeJson(Object dto) {
        try {
            log.info(objectMapper
                    .writerWithDefaultPrettyPrinter()
                    .writeValueAsString(dto));
        } catch (Exception e) {
            log.warn("로그 직렬화 실패", e);
        }
    }

    private Long calcDuration(ServletRequestAttributes attrs) {
        if (attrs == null) {
            return null;
        }
        Object startedAt = attrs.getRequest().getAttribute(START_TIME_NS);
        if (startedAt instanceof Long startNs) {
            return (System.nanoTime() - startNs) / 1_000_000L;
        }
        return null;
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isBlank() && !"unknown".equalsIgnoreCase(ip)) {
            return ip.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String stackToOneLine(Throwable e) {
        StringBuilder sb = new StringBuilder();
        for (StackTraceElement el : e.getStackTrace()) {
            sb.append(el).append(" | ");
        }
        return sb.toString();
    }
}
