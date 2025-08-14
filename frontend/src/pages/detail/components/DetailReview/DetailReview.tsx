import styled from '@emotion/styled';
import filledStar from '../../../../common/assets/images/starIcon.svg';
import ReviewItem from '../ReviewItem/ReviewItem';

const REVIEW_MOCK = {
  ratingAverage: 4,
  ratingCount: 2,
  reviews: [
    {
      id: 23,
      reviewerName: '김**',
      createdAt: '2025-08-07',
      rating: 5,
      content:
        '정말 전문적이고 친절한 상담이었습니다. 개인별 맞춤 운동법을 자세히 설명해주셔서 매우 도움이 되었어요. 15분이 짧다고 생각했는데 알찬 내용으로 가득했습니다!',
    },
    {
      id: 36,
      reviewerName: '박**',
      createdAt: '2025-08-07',
      rating: 3,
      content: '보통이었어요',
    },
  ],
};

function DetailReview() {
  return (
    <StyledContainer>
      <StyledTotalWrapper>
        <img src={filledStar} />
        <strong>{REVIEW_MOCK.ratingAverage}</strong>
        <p>({REVIEW_MOCK.ratingCount}개 리뷰)</p>
      </StyledTotalWrapper>
      <StyledReviewList>
        {REVIEW_MOCK.reviews.map((review) => (
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
