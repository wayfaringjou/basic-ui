import type { OptionLinkedList } from "./option-linked-list";
import type {
  Dispatch,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
} from "react";

/**
 * Pipes fowarded ref and local ref to assign both to current
 */
export function sharedRef<T>(
  node: T | null,
  ref: ForwardedRef<T>,
  _ref?: MutableRefObject<T | null>
) {
  if (node && ref) {
    if (typeof ref === "function") {
      ref(node);
    } else {
      if (!ref.current) {
        ref.current = node;
      }
    }
  }
  if (_ref && !_ref.current) {
    _ref.current = node;
  }
  return node;
}

/**
 * Call all functions passed as arguments
 * @see https://malcolmkee.com/blog/typesafe-call-all/
 */
export function callAll<Args extends unknown[]>(
  ...fns: (((...args: Args) => unknown) | undefined)[]
) {
  return (...args: Args) => {
    for (const function_ of fns) {
      typeof function_ === "function" && function_(...args);
    }
  };
}

// interface CallBack<Params extends any[]> {
//   (...args: Params): void;
// }

// export const callAll =
//   <Params extends any[]>(...fns: Array<CallBack<Params> | undefined>) =>
//   (...args: Params) =>
//     fns.forEach((fn) => typeof fn === "function" && fn(...args));

/**
 * Events reducers
 */

export function clickReducer(
  dispatch: Dispatch<SetStateAction<HTMLLIElement | undefined>>,
  action: {
    event: MouseEvent<HTMLUListElement>;
    listbox: HTMLUListElement | null;
  }
) {
  const target = action.event.target as HTMLElement;
  const role = target.getAttribute("role");
  if (target !== action.listbox && role === "option") {
    dispatch(target as HTMLLIElement);
  }
}

export function keyDownReducer(
  dispatch: Dispatch<SetStateAction<HTMLLIElement | undefined>>,
  action: {
    type: KeyboardEvent<HTMLUListElement>["key"];
    payload: {
      optionMap: OptionLinkedList;
      selectedNode: HTMLLIElement | undefined;
    };
  }
) {
  const { optionMap, selectedNode } = action.payload;
  if (optionMap.size() === 0) {
    return;
  }

  switch (action.type) {
    case "ArrowDown": {
      if (selectedNode === undefined) {
        const firstOption = optionMap.first();
        if (!firstOption) break;

        dispatch(firstOption.element);
        break;
      } else {
        const nextOption = optionMap.next(selectedNode.id);
        if (!nextOption) break;

        dispatch(nextOption.element);
      }
      break;
    }
    case "ArrowUp": {
      if (selectedNode === undefined) {
        const lastOption = optionMap.last();
        if (!lastOption) break;

        dispatch(lastOption.element);
        break;
      } else {
        const previousOption = optionMap.prev(selectedNode.id);
        if (!previousOption) break;

        dispatch(previousOption.element);
      }
      break;
    }
    case "Home": {
      const firstOption = optionMap.first();
      if (!firstOption) break;

      dispatch(firstOption.element);
      break;
    }
    case "End": {
      const lastOption = optionMap.last();
      if (!lastOption) break;

      dispatch(lastOption.element);
      break;
    }
    default: {
      return;
    }
  }
}
