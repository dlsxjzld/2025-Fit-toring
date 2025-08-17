package fittoring.mentoring.business.service.dto;

public record ReviewStats(
        Long mentoringId,
        Double reviewAverage,
        long reviewCount) {
}
