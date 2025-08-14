package fittoring.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.NullNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class JsonUtil {

    private final ObjectMapper objectMapper;

    private final Set<String> MASKING_KEYS = Set.of(
            "phoneNumber",
            "phone",
            "password",
            "accessToken",
            "refreshToken"
    );

    public String extractBodyPretty(String raw) {
        if (raw == null) return "null";

        String json = raw.strip();
        if (!json.startsWith("{")) json = "{" + json + "}";

        try {
            JsonNode root = objectMapper.readTree(json);
            JsonNode body = root.path("body");
            if (body.isMissingNode() || body.isNull()) return "null";
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(body);
        } catch (Exception e) {
            // 파싱 실패 시 원문 반환
            return raw;
        }
    }

    // 키 기반 마스킹 + Json 형식으로 예쁘게 출력 (JSON이 아니면 원문 반환)
    public String maskAndPretty(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            JsonNode masked = maskNode(node);
            return objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(masked);
        } catch (Exception e) {
            return json;
        }
    }

    // 키 기반 마스킹
    private JsonNode maskNode(JsonNode node) {
        if (node == null) return NullNode.getInstance();

        if (node.isObject()) {
            ObjectNode obj = node.deepCopy();
            Iterator<String> names = obj.fieldNames();
            List<String> keys = new ArrayList<>();
            names.forEachRemaining(keys::add);

            for (String key : keys) {
                JsonNode val = obj.get(key);
                if (val == null) continue;
                if (val.isValueNode()) {
                    String replaced = maskValueByKey(key, val);
                    if (replaced != null) obj.put(key, replaced);
                } else {
                    obj.set(key, maskNode(val));
                }
            }
            return obj;
        }
        if (node.isArray()) {
            ArrayNode arr = objectMapper.createArrayNode();
            node.forEach(el -> arr.add(maskNode(el)));
            return arr;
        }
        return node;
    }

    private String maskValueByKey(String key, JsonNode val) {
        String original = textOf(val);
        if (MASKING_KEYS.contains(key)) {
            if (key.contains("phoneNumber") || key.equals("phone")) return maskPhoneMid4(original);
            if (key.contains("password") || key.contains("accessToken") || key.contains("refreshToken"))
                return maskSecret(original);
        }
        return null;
    }

    private static String textOf(JsonNode val) {
        if (val == null || val.isNull()) return "";
        return val.asText();
    }

    // 가운데 4자리 마스킹 ex. 010-****-1234
    public static String maskPhoneMid4(String phone) {
        if (phone == null) return null;
        return phone.replaceAll("(?<=^\\d{3}-)\\d{4}(?=-\\d{4}$)", "****");
    }

    // 맨 뒤 2자리 제외 마스킹 ex. 123456 -> ****56
    private static String maskSecret(String str) {
        if (str == null) return null;
        int len = str.length();
        if (len <= 2) return "**";
        return "*".repeat(len - 2) + str.substring(len - 2);
    }
}
