import { MemoryRouter } from 'react-router-dom';

import DetailReview from './DetailReview';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Detail/DetailReview',
  component: DetailReview,

  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof DetailReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultDetailReview: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'DetailReview 컴포넌트는 멘토링 상세 페이지에서 리뷰 목록을 표시합니다. 멘토의 총 별점과 리뷰를 확인할 수 있습니다.',
      },
    },
  },
};
