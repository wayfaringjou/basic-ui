import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import Listbox, { type ListboxProps } from "@basic-ui/react-listbox";
import * as React from "react";
import "./styles.css";

const meta: Meta<typeof Listbox> = {
  component: Listbox,
};

export default meta;

interface ExtraArgs {
  options: number;
}

type Story = StoryObj<ListboxProps & ExtraArgs>;

const ListboxTemplate: Story = {
  args: {
    options: 8,
  },
  argTypes: {
    options: {
      name: "Number of options in list.",
      control: { type: "number", min: 1, max: 10 },
    },
  },
  render: ({ options }) => {
    const terms = Array.from({ length: options }).map(
      (_, index) => `Item ${index + 1}`
    );
    const [active, setActive] = React.useState<HTMLLIElement>();
    const [index, setIndex] = React.useState<string | null | undefined>("");

    React.useEffect(() => {
      setIndex(active?.dataset.value);
    }, [active]);

    return (
      <>
        <h2 id="list-title">Items</h2>
        <Listbox
          onActiveChange={setActive}
          // ref={ListboxRef}
          aria-labelledby="list-title"
        >
          <Listbox.Group>
            {terms.map((term, index) => (
              <Listbox.Option key={index} id={`item-${index}`} dataValue={term}>
                {term}
              </Listbox.Option>
            ))}
          </Listbox.Group>
        </Listbox>
        <input type="text" />
        <pre data-testid="selected-value">Selected item: {index}</pre>
      </>
    );
  },
};

export const SingleSelect: Story = {
  ...ListboxTemplate,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const listbox = canvas.getByRole("listbox");
    const options = canvas.getAllByRole("option");
    const valueViz = canvas.getByTestId("selected-value");

    await step("Is in the page Tab sequence", async () => {
      await user.keyboard("[Tab]");
      expect(document.activeElement).toBe(listbox);
    });

    await step("Home key makes first element active", async () => {
      await user.keyboard("[Home]");
      expect(document.activeElement).toBe(options[0]);
      expect(valueViz.textContent).toBe("Selected item: Item 1");
    });

    await step("End key makes last element active", async () => {
      await user.keyboard("[End]");
      expect(document.activeElement).toBe(options.at(-1));
    });

    await step("Down key makes next element active", async () => {
      await user.keyboard("[Home]");
      await user.keyboard("[ArrowDown]");
      if (options.length < 2) {
        expect(document.activeElement).toBe(options[0]);
        expect(valueViz.textContent).toBe("Selected item: Item 1");
      } else {
        expect(document.activeElement).toBe(options.at(1));
        expect(valueViz.textContent).toBe("Selected item: Item 2");
      }
    });

    await step("Up key makes previous element active", async () => {
      await user.keyboard("[End]");
      await user.keyboard("[ArrowUp]");
      if (options.length < 2) {
        expect(document.activeElement).toBe(options.at(0));
      } else {
        expect(document.activeElement).toBe(options.at(-2));
      }
    });
  },
};
