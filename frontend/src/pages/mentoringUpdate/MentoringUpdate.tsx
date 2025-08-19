import styled from '@emotion/styled';

import MentoringUpdateForm from './components/MentoringUpdateForm/MentoringUpdateForm';
import MentoringUpdateHeader from './components/MentoringUpdateHeader/MentoringUpdateHeader';

function MentoringUpdate() {
  return (
    <>
      <MentoringUpdateHeader />
      <StyledWrapper>
        <MentoringUpdateForm />
      </StyledWrapper>
    </>
  );
}

export default MentoringUpdate;

const StyledWrapper = styled.div`
  padding: 3.2rem 1.6rem;
`;
