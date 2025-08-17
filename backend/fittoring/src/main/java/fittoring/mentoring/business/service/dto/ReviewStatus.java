package fittoring.mentoring.business.service.dto;

public record ReviewStatus(
        Long mentoringId,
        Double reviewAverage,
        long reviewCount) {
}
