import * as React from "react";
import { useListbox } from "./Listbox";
import { sharedRef } from "./utils";

type Ref = HTMLLIElement;
export interface OptionProps extends React.ComponentPropsWithoutRef<"li"> {
  dataValue?: string;
}

const Option = React.forwardRef<Ref, OptionProps>(
  ({ children, id, dataValue, ...props }, ref) => {
    const { selectedNode, optionMap } = useListbox();
    const _ref = React.useRef<React.ElementRef<"li">>(null);
    const selected = selectedNode?.id === id;

    React.useLayoutEffect(() => {
      if (selected) {
        _ref.current?.scrollIntoView({ block: "nearest", behavior: "auto" });
      }
    }, [selected]);

    return (
      <li
        role="option"
        aria-selected={selected}
        id={id}
        ref={(node) => {
          sharedRef(node, ref, _ref);
          if (!id) throw new Error("Id is needed");
          if (node) {
            optionMap.current.set(node);
          } else {
            const mappedNode = optionMap.current.get(id);
            if (mappedNode) {
              optionMap.current.delete(id);
            }
          }
        }}
        data-selected={selected}
        {...(dataValue && { "data-value": dataValue })}
        {...props}
      >
        {children}
      </li>
    );
  }
);

Option.displayName = "Listbox.Option";

export default Option;
