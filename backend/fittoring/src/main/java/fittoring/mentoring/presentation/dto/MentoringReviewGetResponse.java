package fittoring.mentoring.presentation.dto;

import java.util.List;

public record MentoringReviewGetResponse(
    int ratingCount,
    String ratingAverage,
    List<ReviewGetResponse> reviews
) {

}
