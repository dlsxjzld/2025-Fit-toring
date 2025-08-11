package fittoring.mentoring.business.model;

import java.util.Arrays;

public enum CertificateType {

    LICENSE,
    EDUCATION,
    AWARD,
    ETC,
    ;

    public static boolean inValidCertificateType(CertificateType certificateType) {
        return !Arrays.asList(CertificateType.values()).contains(certificateType);
    }
}
