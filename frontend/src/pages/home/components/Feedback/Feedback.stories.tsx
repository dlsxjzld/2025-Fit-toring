import { MemoryRouter } from 'react-router-dom';

import { PAGE_URL } from '../../../../common/constants/url';

import Feedback from './Feedback';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Home/Feedback',
  component: Feedback,

  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={[PAGE_URL.HOME]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof Feedback>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Feedback 컴포넌트는 홈 페이지의 피드백 섹션을 구성합니다. 사용자 피드백을 수집하기 위한 Google Form 링크를 포함하고 있습니다.',
      },
    },
  },
};
