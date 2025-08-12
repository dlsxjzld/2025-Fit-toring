import styled from '@emotion/styled';

function Certificates() {
  return (
    <StyledContainer>
      <StyledTitle>검증된 자격 사항</StyledTitle>
    </StyledContainer>
  );
}

export default Certificates;

const StyledContainer = styled.section`
  display: flex;

  width: 100%;
  height: 100%;
  padding: 0 1rem;
`;

const StyledTitle = styled.h3`
  flex-grow: 1;

  color: ${({ theme }) => theme.FONT.B01};
  ${({ theme }) => theme.TYPOGRAPHY.H3_R}
`;
