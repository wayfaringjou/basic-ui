import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Combobox from "@basic-ui/react-combobox";

const meta: Meta<typeof Combobox> = {
  component: Combobox,
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const ComboboxTemplate: Story = {
  render: () => {
    return (
      <Combobox>
        <Combobox.Input />
        <Combobox.Popup />
      </Combobox>
    );
  },
};

const recentTerms = new Promise<string[]>((resolve) =>
  resolve(["recent", "search", "terms"])
);

export const NoAutocomplete: Story = {
  ...ComboboxTemplate,
  loaders: [
    async () => ({
      recent: await recentTerms,
    }),
  ],
  render: (_, { loaded: { recent } }) => {
    return (
      <Combobox>
        <Combobox.Input />
        <Combobox.Popup>
          <ul role="listbox">
            {(recent as string[]).map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </Combobox.Popup>
      </Combobox>
    );
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const combobox = canvas.getByRole("combobox");

    await step("Is in the page Tab sequence", async () => {
      await user.keyboard("[Tab]");
      expect(document.activeElement).toBe(combobox);
    });

    await user.type(combobox, "Test");
  },
};

export const ManualSelectAutocomplete = {
  ...ComboboxTemplate,
};

export const AutoSelectAutocomplete = {
  ...ComboboxTemplate,
};

export const InlineAutocomplete = {
  ...ComboboxTemplate,
};
