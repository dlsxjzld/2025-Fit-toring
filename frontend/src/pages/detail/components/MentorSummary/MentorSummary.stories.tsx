import MentorSummary from './MentorSummary';

import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'Detail/MentorSummary',
  component: MentorSummary,

  decorators: [(Story) => <Story />],
} satisfies Meta<typeof MentorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultMentorSummary: Story = {
  args: {
    introduction:
      '안녕하세요 김트레이너 입니다. 여러분의 건강과 체력을 책임지겠습니다.',
    career: 5,
    certificates: [
      {
        certificateId: '1',
        title: '스포츠안마 자격증',
        type: 'LICENSE',
        imageUrl: '',
      },
      {
        certificateId: '2',
        title: '한국대학교 졸업증명서',
        type: 'EDUCATION',
        imageUrl: '',
      },
      {
        certificateId: '3',
        title: '헬스 트레이너 자격증',
        type: 'LICENSE',
        imageUrl: '',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'MentorSummary 컴포넌트는 상세 정보 페이지의 요약 정보를 표시합니다. 트레이너의 전문성과 서비스에 대한 간략한 설명을 포함하고 있습니다.',
      },
    },
  },
};
