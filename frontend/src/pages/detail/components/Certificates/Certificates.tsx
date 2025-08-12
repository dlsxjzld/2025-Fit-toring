import styled from '@emotion/styled';

import type { CertificateResponse } from '../../types/CertificatesResponse';

interface CertificatesProps {
  certificates: CertificateResponse[];
}

function Certificates({ certificates }: CertificatesProps) {
  return (
    <StyledContainer>
      <StyledTitle>검증된 자격 사항</StyledTitle>
      <StyledList>
        {certificates.map((item) => (
          <li>{item.imageUrl}</li>
        ))}
      </StyledList>
    </StyledContainer>
  );
}

export default Certificates;

const StyledContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  width: 100%;
`;

const StyledTitle = styled.h3`
  flex-grow: 1;

  color: ${({ theme }) => theme.FONT.B01};
  ${({ theme }) => theme.TYPOGRAPHY.H3_R}
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;
