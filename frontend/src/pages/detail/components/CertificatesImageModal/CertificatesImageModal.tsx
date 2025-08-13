import styled from '@emotion/styled';

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
      <StyledContainer src={imageUrl} alt={`${title}`} />
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
