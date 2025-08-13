package fittoring.mentoring.presentation.dto;

import fittoring.mentoring.business.model.Image;
import fittoring.mentoring.business.model.Mentoring;
import java.util.List;

public record MentoringSummaryResponse(
        long id,
        String mentorName,
        List<String> categories,
        int price,
        int career,
        String profileImageUrl,
        String introduction
) {

    public static MentoringSummaryResponse of(Mentoring mentoring, List<String> categories, Image image) {
        if (image == null) {
            return MentoringSummaryResponse.of(mentoring, categories);
        }
        return new MentoringSummaryResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categories,
                mentoring.getPrice(),
                mentoring.getCareer(),
                image.getUrl(),
                mentoring.getIntroduction()
        );
    }

    public static MentoringSummaryResponse of(Mentoring mentoring, List<String> categories) {
        return new MentoringSummaryResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categories,
                mentoring.getPrice(),
                mentoring.getCareer(),
                null,
                mentoring.getIntroduction()
        );
    }
}
