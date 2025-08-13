import styled from '@emotion/styled';

import Modal from '../../../../common/components/Modal/Modal';

interface CertificatesImageModalProps {
  opened: boolean;
  onCloseClick: () => void;
}

function CertificatesImageModal({
  opened,
  onCloseClick,
}: CertificatesImageModalProps) {
  return (
    <Modal opened={opened} onCloseClick={onCloseClick}>
      <StyledContainer>자격증 사진</StyledContainer>
    </Modal>
  );
}

export default CertificatesImageModal;

const StyledContainer = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;
