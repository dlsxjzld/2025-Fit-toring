import styled from '@emotion/styled';

const GoogleFormUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSfQlaSrxUmU-CKnK6jnp8qLTdGMmLYbff2CZSUmKE09OHN11w/viewform';

function Feedback() {
  return (
    <StyledContainer>
      <StyledLink href={GoogleFormUrl} target="_blank">
        서비스 피드백
      </StyledLink>
    </StyledContainer>
  );
}

export default Feedback;

const StyledContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  width: 100%;
  height: 100%;
  padding: 1rem 1.4rem;

  background: ${({ theme }) => theme.BG.GREEN};
`;

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;

  width: fit-content;
  height: 100%;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;

  background: ${({ theme }) => theme.SYSTEM.MAIN600};

  color: ${({ theme }) => theme.FONT.W01};
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.SYSTEM.MAIN500};
  }

  ${({ theme }) => theme.TYPOGRAPHY.BTN2_R}
`;
