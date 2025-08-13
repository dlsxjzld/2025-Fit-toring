package fittoring.aspect;

import com.fasterxml.jackson.databind.ObjectMapper;
import fittoring.util.JsonUtil;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ContentCachingRequestWrapper;

@RequiredArgsConstructor
@Slf4j
@Aspect
@Component
public class LogAspect {

    private final ObjectMapper objectMapper;
    private final JsonUtil jsonUtil;

    @Pointcut("execution(* fittoring..*Controller.*(..))")
    public void controller() {
    }

    @Before("controller()")
    public void logBeforeApiCall() {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

        if (logHttpInfoWithRequestBody(attributes)) {
            return;
        }
        logHttpInfo(attributes, "REQUEST", null);
    }

    private boolean logHttpInfoWithRequestBody(ServletRequestAttributes attributes) {
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            if (request instanceof ContentCachingRequestWrapper wrapper) {
                byte[] content = wrapper.getContentAsByteArray();
                if (content.length == 0) {
                    try {
                        wrapper.getInputStream().readAllBytes();
                        content = wrapper.getContentAsByteArray();
                    } catch (IOException e) {
                        log.warn("요청 바디를 읽는데 실패하였습니다.", e);
                    }
                }

                if (content.length > 0) {
                    String body = new String(content, StandardCharsets.UTF_8);
                    logHttpInfo(attributes, "REQUEST", body);
                    return true;
                }
            }
        }
        return false;
    }

    private void logHttpInfo(ServletRequestAttributes attributes, String prefix, String body) {
        if (attributes != null) {
            HttpServletRequest request = attributes.getRequest();
            String httpMethod = request.getMethod();
            String requestUri = request.getRequestURI();
            String queryString = request.getQueryString();

            String clientIp = getClientIp(request);
            String userAgent = request.getHeader("User-Agent");

            log.info(
                    "{}:[{} {} Query={} Body={}] client=[{}:{}]",
                    prefix,
                    httpMethod,
                    requestUri,
                    queryString,
                    jsonUtil.maskAndPretty(body),
                    clientIp,
                    userAgent
            );
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
            return ip.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    @AfterReturning(pointcut = "controller()", returning = "result")
    public void logAfterApiCall(Object result) {
        ServletRequestAttributes attributes =
                (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        try {
            logHttpInfo(
                    attributes,
                    "RESPONSE",
                    jsonUtil.extractBodyPretty(
                            objectMapper.writeValueAsString(result)
                    )
            );
        } catch (Exception e) {
            log.error("RESPONSE JSON 포매팅 실패: {}", result, e);
        }
    }

    @AfterThrowing(pointcut = "controller()", throwing = "e")
    public void afterThrowingController(JoinPoint joinPoint, Throwable e) {
        Method method = getMethod(joinPoint);
        log.warn("[{}], [{}], [{}], [{}]", e.getClass(), e.getMessage(), method.getName(), e.getStackTrace());
    }

    private Method getMethod(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        return signature.getMethod();
    }
}
