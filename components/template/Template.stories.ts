import type { Meta, StoryObj } from '@storybook/react';

import { Template } from './Template';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta: Meta<typeof Template> = {
  title: 'Components/Template',
  component: Template,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;
type Story = StoryObj<typeof Template>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Demo1: Story = {
  args: {},
};

export const Demo2: Story = {
  args: {},
};
