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
    const [selected, setSelected] = React.useState<HTMLLIElement>();
    const [index, setIndex] = React.useState<string | null | undefined>("");
    const ListboxRef = React.useRef(null);
    React.useEffect(() => {
      setIndex(selected?.dataset.value);
    }, [selected]);
    return (
      <>
        <h2 id="list-title">Items</h2>
        <Listbox
          onSelection={setSelected}
          ref={ListboxRef}
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

    await step("Home key selects first element", async () => {
      await user.keyboard("[Home]");
      expect(options[0].getAttribute("aria-selected")).toBe("true");
      expect(valueViz.textContent).toBe("Selected item: Item 1");
    });

    await step("End key selects last element", async () => {
      await user.keyboard("[End]");
      expect(options.at(-1)?.getAttribute("aria-selected")).toBe("true");
    });

    await step("Down key selects next element", async () => {
      await user.keyboard("[Home]");
      await user.keyboard("[ArrowDown]");
      if (options.length < 2) {
        expect(options.at(0)?.getAttribute("aria-selected")).toBe("true");
        expect(valueViz.textContent).toBe("Selected item: Item 1");
      } else {
        expect(options.at(1)?.getAttribute("aria-selected")).toBe("true");
        expect(valueViz.textContent).toBe("Selected item: Item 2");
      }
    });

    await step("Up key selects previous element", async () => {
      await user.keyboard("[End]");
      await user.keyboard("[ArrowUp]");
      if (options.length < 2) {
        expect(options.at(0)?.getAttribute("aria-selected")).toBe("true");
      } else {
        expect(options.at(-2)?.getAttribute("aria-selected")).toBe("true");
      }
    });
  },
};
