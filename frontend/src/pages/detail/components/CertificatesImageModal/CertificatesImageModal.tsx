import styled from '@emotion/styled';

import closeImg from '../../../../common/assets/images/white-x-mark.svg';
import Modal from '../../../../common/components/Modal/Modal';

interface CertificatesImageModalProps {
  opened: boolean;
  onCloseClick: () => void;
  imageUrl: string;
  title: string;
}

function CertificatesImageModal({
  opened,
  onCloseClick,
  imageUrl,
  title,
}: CertificatesImageModalProps) {
  return (
    <Modal opened={opened} onCloseClick={onCloseClick}>
      <StyledContainer>
        <StyledCloseButton onClick={onCloseClick}>
          <StyledCloseImage src={closeImg} alt="모달 닫기 버튼" />
        </StyledCloseButton>
        <StyledImage src={imageUrl} alt={`${title}`} />
      </StyledContainer>
    </Modal>
  );
}

export default CertificatesImageModal;

const StyledContainer = styled.div`
  position: relative;
`;

const StyledImage = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  max-height: 65vh;
  object-fit: cover;
`;

const StyledCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6rem;
  right: -2rem;

  padding: 0;
  border: none;

  background: none;
  cursor: pointer;
`;

const StyledCloseImage = styled.img`
  width: 3rem;
  height: 3rem;
`;
