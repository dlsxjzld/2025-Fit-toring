import { MemoryRouter } from 'react-router-dom';

import { PAGE_URL } from '../../../common/constants/url';

import ReviewModal from './ReviewModal';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'ParticipatedMentoring/ReviewModal',
  component: ReviewModal,

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[PAGE_URL.PARTICIPATED_MENTORING]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ReviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultReviewModal: Story = {
  args: {
    reservationId: 1,
    mentorName: '홍길동',
    opened: true,
    onCloseClick: () => {},
    onReviewSubmitButtonClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'ReviewModal 컴포넌트는 멘토링 상담 후 리뷰를 작성할 수 있는 모달입니다',
      },
    },
  },
};
