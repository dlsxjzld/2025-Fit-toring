import { BrowserRouter } from 'react-router-dom';

import MentoringUpdateHeader from './MentoringUpdateHeader';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'mentoringUpdate/MentoringUpdateHeader',
  component: MentoringUpdateHeader,

  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof MentoringUpdateHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMentoringCreateHeader: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'MentoringUpdateHeader 컴포넌트는 멘토링 개설 페이지의 헤더를 구성합니다. 뒤로 가기 버튼과 제목을 포함하고 있습니다.',
      },
    },
  },
};
