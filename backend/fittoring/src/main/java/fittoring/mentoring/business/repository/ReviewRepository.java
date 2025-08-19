package fittoring.mentoring.business.repository;

import fittoring.mentoring.business.model.Review;
import fittoring.mentoring.business.service.dto.RatingStatsDto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.data.repository.query.Param;

public interface ReviewRepository extends ListCrudRepository<Review, Long> {

    Optional<Review> findByReservationId(Long reservationId);

    List<Review> findAllByMentee_Id(Long menteeId);

    @Query("""
            SELECT new fittoring.mentoring.business.service.dto.RatingStatsDto(
                COUNT(rv), COALESCE(AVG(rv.rating), 0.0)
            )
            FROM Review rv
            JOIN rv.reservation res
            WHERE res.mentoring.id = :mentoringId
            """)
    RatingStatsDto findRatingStatsByMentoringId(@Param("mentoringId") Long mentoringId);

    boolean existsByReservationId(Long reservationId);

    boolean existsByReservationIdAndMentee_Id(Long reservationId, Long menteeId);

    void deleteByReservationId(Long reservationId);
}
