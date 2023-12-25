import * as React from "react";
import Option from "./Option";
import Group from "./Group";
import { callAll, clickReducer, keyDownReducer, sharedRef } from "./utils";
import { OptionList } from "./option-list";

interface ListboxConextType {
  nodesStatus: {
    active: HTMLLIElement | undefined;
    selected: HTMLLIElement | undefined;
  };
  optionList: React.MutableRefObject<OptionList>;
}

const ListboxContext = React.createContext<ListboxConextType | undefined>(undefined);

export const useListbox = () => {
  const context = React.useContext(ListboxContext);
  if (!context) {
    throw new Error("useListbox must be used within a <Listbox />");
  }
  return context;
};

type Ref = HTMLUListElement;

export interface ListboxProps extends React.ComponentPropsWithoutRef<"ul"> {
  onSelectionChange?: (target: HTMLLIElement) => void;
  onActiveChange?: (target: HTMLLIElement) => void;
}

/**
 * Listbox Root
 */
const Listbox = React.forwardRef<Ref, ListboxProps>(
  (
    {
      children,
      onSelectionChange,
      onActiveChange,
      onClick,
      onKeyDown,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [nodesStatus, setNodesStatus] = React.useState<{
      active: HTMLLIElement | undefined;
      selected: HTMLLIElement | undefined;
    }>({ active: undefined, selected: undefined });

    // Each option element is saved in this list to manage navigation and focus
    const optionList = React.useRef<OptionList>(new OptionList());

    const _ref = React.useRef<HTMLUListElement | null>(null);

    React.useLayoutEffect(() => {
      if (!onSelectionChange || nodesStatus.selected === undefined) return;
      onSelectionChange(nodesStatus.selected);
    }, [nodesStatus.selected]);

    React.useLayoutEffect(() => {
      if (!onActiveChange || nodesStatus.active === undefined) return;
      onActiveChange(nodesStatus.active);
    }, [nodesStatus.active]);

    React.useEffect(() => {
      /**
       * If the element with role listbox is not part of another widget,
       * such as a combobox, then it has either a visible label
       * referenced by aria-labelledby or a value specified for aria-label.
       */
      // Check props and context
      if (!props["aria-labelledby"] && !props["aria-label"])
        throw new Error(
          "Listbox requires aria-labelledby or aria-label if not part of another widget."
        );
    }, [props["aria-labelledby"], props["aria-label"]]);

    function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
      const managedKeys = ["ArrowDown", "ArrowUp", "Home", "End"];

      if (managedKeys.includes(event.key)) {
        event.preventDefault();

        keyDownReducer(setNodesStatus, {
          type: event.key,
          payload: {
            nodesStatus,
            optionList: optionList.current,
          },
        });
      }
    }

    function handleClick(event: React.MouseEvent<HTMLUListElement>) {
      if (!_ref.current) return;
      clickReducer(setNodesStatus, { event, listbox: _ref.current });
    }

    const [isFocused, setIsFocused] = React.useState(false);

    const handleOnFocus: React.FocusEventHandler<HTMLUListElement> = () => {
      setIsFocused(true);
    };
    const handleOnBlur: React.FocusEventHandler<HTMLUListElement> = (event) => {
      setIsFocused(false);
      // If an element besides the Listbox or its options receives focus, clear active
      if (!optionList.current.has(event.relatedTarget)) {
        setNodesStatus((state) => ({ ...state, active: undefined }));
      }
    };

    return (
      <ul
        role="listbox"
        onFocus={callAll(handleOnFocus, onFocus)}
        onBlur={callAll(handleOnBlur, onBlur)}
        tabIndex={isFocused ? -1 : 0}
        onKeyDown={callAll(handleKeyDown, onKeyDown)}
        onClick={callAll(handleClick, onClick)}
        ref={(node) => sharedRef(node, ref, _ref)}
        {...props}
      >
        <ListboxContext.Provider value={{ nodesStatus, optionList }}>
          {children}
        </ListboxContext.Provider>
      </ul>
    );
  }
);

Listbox.displayName = "Listbox";

export default Object.assign(Listbox, { Option, Group });
