import { MemoryRouter } from 'react-router-dom';

import { PAGE_URL } from '../../../common/constants/url';

import StarRating from './StarRating';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'ParticipatedMentoring/StarRating',
  component: StarRating,

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[PAGE_URL.PARTICIPATED_MENTORING]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof StarRating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultRating: Story = {
  args: {
    rating: 5,
    onRatingChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          'StarRating 컴포넌트는 사용자가 별점을 선택할 수 있는 UI를 제공합니다.',
      },
    },
  },
};

export const ThreeStarsRating: Story = {
  args: {
    rating: 3,
    onRatingChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: '3점 평가를 위한 StarRating 컴포넌트입니다.',
      },
    },
  },
};
