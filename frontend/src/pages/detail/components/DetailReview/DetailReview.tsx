import styled from '@emotion/styled';
import filledStar from '../../../../common/assets/images/starIcon.svg';
import ReviewItem from '../ReviewItem/ReviewItem';
import { getReviews } from '../../apis/getReviews';
import { useEffect, useState } from 'react';
import { ReviewResponse } from '../../types/ReviewResponse';

interface DetailReviewProps {
  mentoringId: number;
}

function DetailReview({ mentoringId }: DetailReviewProps) {
  const [totalReviewInfo, setTotalReviewInfo] = useState<ReviewResponse | null>(
    null,
  );

  const fetchReview = async () => {
    try {
      const response = await getReviews(mentoringId);
      setTotalReviewInfo(response);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  if (!totalReviewInfo) return null;

  return (
    <StyledContainer>
      <StyledTotalWrapper>
        <img src={filledStar} />
        <strong>{totalReviewInfo.ratingAverage}</strong>
        <p>({totalReviewInfo.ratingCount}개 리뷰)</p>
      </StyledTotalWrapper>
      <StyledReviewList>
        {totalReviewInfo.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </StyledReviewList>
    </StyledContainer>
  );
}

export default DetailReview;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;

  width: 100%;
  margin-top: 4rem;
`;

const StyledTotalWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  > img {
    width: 2.4rem;
    height: 2.4rem;
  }

  > strong {
    ${({ theme }) => theme.TYPOGRAPHY.LB3_R}
    color: ${({ theme }) => theme.FONT.B01};
  }

  > p {
    ${({ theme }) => theme.TYPOGRAPHY.B2_R}
    color: ${({ theme }) => theme.FONT.B04};
  }
`;

const StyledReviewList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
`;
