package fittoring.mentoring.presentation.dto;

import fittoring.mentoring.business.model.Image;
import fittoring.mentoring.business.model.Mentoring;
import java.util.List;

public record MentoringResponse(
        long id,
        String mentorName,
        List<String> categories,
        int price,
        int career,
        String profileImageUrl,
        String introduction,
        String content,
        List<CertificateSpecAndImageResponse> certificates
) {

    public static MentoringResponse of(
            Mentoring mentoring,
            List<String> categoryTitles,
            List<CertificateSpecAndImageResponse> certificates
    ) {
        return new MentoringResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categoryTitles,
                mentoring.getPrice(),
                mentoring.getCareer(),
                null,
                mentoring.getIntroduction(),
                mentoring.getContent(),
                certificates
        );
    }

    public static MentoringResponse of(
            Mentoring mentoring,
            List<String> categoryTitles,
            Image image,
            List<CertificateSpecAndImageResponse> certificates
    ) {
        if (image == null) {
            return of(mentoring, categoryTitles, certificates);
        }
        return new MentoringResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categoryTitles,
                mentoring.getPrice(),
                mentoring.getCareer(),
                image.getUrl(),
                mentoring.getIntroduction(),
                mentoring.getContent(),
                certificates
        );
    }
}
