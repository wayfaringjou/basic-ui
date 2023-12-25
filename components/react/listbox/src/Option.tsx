import * as React from "react";
import { useListbox } from "./Listbox";
import { sharedRef } from "./utils";

type Ref = HTMLLIElement;
export interface OptionProps extends React.ComponentPropsWithoutRef<"li"> {
  dataValue?: string;
}

const Option = React.forwardRef<Ref, OptionProps>(
  ({ children, dataValue, ...props }, ref) => {
    const { nodesStatus, optionList } = useListbox();
    // Element reference is used directly for evaluations instead of assigning ids.
    const _ref = React.useRef<React.ElementRef<"li">>();
    const selected =
      nodesStatus.selected !== undefined && nodesStatus.selected === _ref.current;
    const active =
      nodesStatus.active !== undefined && nodesStatus.active === _ref.current;

    React.useEffect(() => {
      if (active && _ref.current?.tabIndex === 0) {
        _ref.current.focus();
      }
    }, [active, _ref.current?.tabIndex]);

    return (
      <li
        role="option"
        aria-selected={selected}
        tabIndex={active ? 0 : -1}
        ref={(node) => {
          sharedRef(node, ref, _ref);

          if (node) {
            optionList.current.set(node);
          } else {
            if (_ref.current && optionList.current.has(_ref.current)) {
              optionList.current.delete(_ref.current);
            }
          }
        }}
        data-selected={selected}
        data-active={active}
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
