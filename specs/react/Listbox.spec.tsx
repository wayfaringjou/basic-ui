import { describe, it } from "vitest";
import { render } from "@testing-library/react";
import Listbox from "@basic-ui/react-listbox";

describe("Listbox", () => {
  it("renders", () => {
    const { getByText } = render(
      <Listbox aria-label="test">
        <Listbox.Option key={1} id={`item-${1}`} dataValue="item-1">
          Test item
        </Listbox.Option>
      </Listbox>
    );
    expect(getByText("Test item")).toBeInTheDocument();
  });
});
