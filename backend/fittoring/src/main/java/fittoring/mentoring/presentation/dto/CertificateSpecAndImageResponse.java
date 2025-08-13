package fittoring.mentoring.presentation.dto;

import fittoring.mentoring.business.model.Certificate;
import fittoring.mentoring.business.model.CertificateType;

public record CertificateSpecAndImageResponse(
        Long certificateId,
        String title,
        CertificateType type,
        String imageUrl
) {

    public static CertificateSpecAndImageResponse of(Certificate certificate, String imageUrl) {
        return new CertificateSpecAndImageResponse(
                certificate.getId(),
                certificate.getTitle(),
                certificate.getType(),
                imageUrl
        );
    }
}
