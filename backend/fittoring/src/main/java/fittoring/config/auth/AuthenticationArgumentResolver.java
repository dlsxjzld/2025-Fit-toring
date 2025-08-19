package fittoring.config.auth;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.MethodParameter;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

@Component
public class AuthenticationArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        boolean hasLoginAnnotation = parameter.hasParameterAnnotation(Login.class);
        boolean hasLoginMemberType = parameter.getParameterType().equals(LoginInfo.class);
        return hasLoginAnnotation && hasLoginMemberType;
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        HttpServletRequest request = (HttpServletRequest) webRequest.getNativeRequest();
        String requestAttributeName = "memberId";
        Object memberId = request.getAttribute(requestAttributeName);
        validateNull(memberId);
        return new LoginInfo((Long) memberId);
    }

    private void validateNull(Object memberId) {
        if (memberId == null) {
            throw new NullPointerException();
        }
    }
}
