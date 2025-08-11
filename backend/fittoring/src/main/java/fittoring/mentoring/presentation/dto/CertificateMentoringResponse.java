package fittoring.mentoring.presentation.dto;

import fittoring.mentoring.business.model.Certificate;
import fittoring.mentoring.business.model.CertificateType;

public record CertificateMentoringResponse(
        Long certificateId,
        String certificateName,
        CertificateType certificateType,
        String imageUrl
) {

    public static CertificateMentoringResponse of(Certificate certificate, String imageUrl) {
        return new CertificateMentoringResponse(
                certificate.getId(),
                certificate.getMentorName(),
                certificate.getType(),
                imageUrl
        );
    }
}
