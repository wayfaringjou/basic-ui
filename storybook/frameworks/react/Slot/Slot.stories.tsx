import type { Meta, StoryObj } from "@storybook/react";
import { Slot } from "@basic-ui/react-slot";

const meta: Meta<typeof Slot> = {
  title: "Meta/Slot",
  component: Slot,
};

export default meta;

type Story = StoryObj<typeof Slot>;

export const Default: Story = {
  render: () => (
    <Slot>
      <>
        <p>Test</p>
      </>
    </Slot>
  ),
};
