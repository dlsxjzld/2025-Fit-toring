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
          <StyledItem key={item.certificateId}>
            {item.certificateName}
          </StyledItem>
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
  ${({ theme }) => theme.TYPOGRAPHY.H4_R}
`;

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const StyledItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;

  padding: 1.6rem;
  border: 1px solid ${({ theme }) => theme.OUTLINE.LIGHT};
  border-radius: 12px;

  background: ${({ theme }) => theme.BG.WHITE};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.SYSTEM.MAIN300};

    box-shadow: 0 2px 8px rgb(15 118 110 / 10%);
  }

  ${({ theme }) => theme.TYPOGRAPHY.B3_R}
`;
