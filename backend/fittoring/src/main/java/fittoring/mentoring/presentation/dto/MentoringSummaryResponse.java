package fittoring.mentoring.presentation.dto;

import fittoring.mentoring.business.model.Image;
import fittoring.mentoring.business.model.Mentoring;
import fittoring.mentoring.business.service.dto.ReviewStats;
import java.util.List;

public record MentoringSummaryResponse(
        long id,
        String mentorName,
        List<String> categories,
        int price,
        int career,
        String profileImageUrl,
        String introduction,
        double reviewAverage,
        long reviewCount
) {

    public static MentoringSummaryResponse of(Mentoring mentoring, List<String> categories, Image image,
                                              ReviewStats reviewStats) {
        if (image == null) {
            return MentoringSummaryResponse.of(mentoring, categories, reviewStats);
        }
        return new MentoringSummaryResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categories,
                mentoring.getPrice(),
                mentoring.getCareer(),
                image.getUrl(),
                mentoring.getIntroduction(),
                reviewStats.reviewAverage(),
                reviewStats.reviewCount()
        );
    }

    private static MentoringSummaryResponse of(Mentoring mentoring, List<String> categories,
                                               ReviewStats reviewStats) {
        return new MentoringSummaryResponse(
                mentoring.getId(),
                mentoring.getMentorName(),
                categories,
                mentoring.getPrice(),
                mentoring.getCareer(),
                null,
                mentoring.getIntroduction(),
                reviewStats.reviewAverage(),
                reviewStats.reviewCount()
        );
    }
}
