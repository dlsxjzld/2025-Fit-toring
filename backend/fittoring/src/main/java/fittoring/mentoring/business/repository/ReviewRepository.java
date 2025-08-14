package fittoring.mentoring.business.repository;

import fittoring.mentoring.business.model.Review;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.ListCrudRepository;

public interface ReviewRepository extends ListCrudRepository<Review, Long> {

    Optional<Review> findByReservationId(Long reservationId);

    List<Review> findAllByMentee_Id(Long menteeId);

    boolean existsByReservationId(Long reservationId);

    boolean existsByReservationIdAndMentee_Id(Long reservationId, Long menteeId);

    void deleteByReservationId(Long reservationId);
}
