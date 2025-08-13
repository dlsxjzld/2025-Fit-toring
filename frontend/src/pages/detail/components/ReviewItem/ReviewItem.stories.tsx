import { MemoryRouter } from 'react-router-dom';

import ReviewItem from './ReviewItem';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Detail/ReviewItem',
  component: ReviewItem,

  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ReviewItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultReviewItem: Story = {
  args: {
    review: {
      id: 23,
      reviewerName: '김**',
      createdAt: '2025-08-07',
      rating: 5,
      content:
        '정말 전문적이고 친절한 상담이었습니다. 개인별 맞춤 운동법을 자세히 설명해주셔서 매우 도움이 되었어요. 15분이 짧다고 생각했는데 알찬 내용으로 가득했습니다!',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'ReviewItem 컴포넌트는 리뷰의 작성자, 작성일, 평점, 내용을 표시합니다. 평점은 별 모양으로 시각적으로 표현됩니다.',
      },
    },
  },
};
