import * as React from "react";
import Option from "./Option";
import Group from "./Group";
import { OptionLinkedList } from "./option-linked-list";
import { callAll, clickReducer, keyDownReducer, sharedRef } from "./utils";

interface ListboxConextType {
  selectedNode: HTMLLIElement | undefined;
  optionMap: React.MutableRefObject<OptionLinkedList>;
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
  onSelection?: (index: HTMLLIElement | undefined) => void;
}

/**
 * Listbox Root
 */
const Listbox = React.forwardRef<Ref, ListboxProps>(
  ({ children, onSelection, onClick, onKeyDown, ...props }, ref) => {
    const [selectedNode, setSelectedNode] = React.useState<HTMLLIElement>();
    const selectedId = selectedNode?.id;

    // Use linked list map of li elements to track selection without index
    const optionMap = React.useRef<OptionLinkedList>(new OptionLinkedList());

    const _ref = React.useRef<HTMLUListElement | null>(null);

    React.useLayoutEffect(() => {
      if (!onSelection) return;
      onSelection(selectedNode);
    }, [selectedId]);

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
    });

    function handleKeyDown(event: React.KeyboardEvent<HTMLUListElement>) {
      event.preventDefault();
      keyDownReducer(setSelectedNode, {
        type: event.key,
        payload: { optionMap: optionMap.current, selectedNode },
      });
    }

    function handleClick(event: React.MouseEvent<HTMLUListElement>) {
      if (!_ref.current) return;
      clickReducer(setSelectedNode, { event, listbox: _ref.current });
    }

    return (
      <ul
        role="listbox"
        aria-activedescendant={selectedId}
        tabIndex={0}
        onKeyDown={callAll(handleKeyDown, onKeyDown)}
        onClick={callAll(handleClick, onClick)}
        ref={(node) => sharedRef(node, ref, _ref)}
        {...props}
      >
        <ListboxContext.Provider value={{ selectedNode, optionMap }}>
          {children}
        </ListboxContext.Provider>
      </ul>
    );
  }
);

Listbox.displayName = "Listbox";

export default Object.assign(Listbox, { Option, Group });
