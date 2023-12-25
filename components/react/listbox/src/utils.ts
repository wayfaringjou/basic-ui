import type {
  Dispatch,
  ForwardedRef,
  KeyboardEvent,
  MouseEvent,
  MutableRefObject,
  SetStateAction,
} from "react";
import { OptionList } from "./option-list";

/**
 * Pipes fowarded ref and local ref to assign both to current
 */
export function sharedRef<T>(
  node: T | undefined,
  ref: ForwardedRef<T>,
  _ref?: MutableRefObject<T | undefined>
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

/**
 * Events reducers
 */

export function clickReducer(
  dispatch: Dispatch<
    SetStateAction<{
      selected: HTMLLIElement | undefined;
      active: HTMLLIElement | undefined;
    }>
  >,
  action: {
    event: MouseEvent<HTMLUListElement>;
    listbox: HTMLUListElement | null;
  }
) {
  const target = action.event.target as HTMLElement;
  const role = target.getAttribute("role");
  if (target !== action.listbox && role === "option") {
    dispatch((state) => ({ ...state, selected: target as HTMLLIElement }));
  }
}

export function keyDownReducer(
  dispatch: Dispatch<
    SetStateAction<{
      selected: HTMLLIElement | undefined;
      active: HTMLLIElement | undefined;
    }>
  >,
  action: {
    type: KeyboardEvent<HTMLUListElement>["key"];
    payload: {
      nodesStatus: {
        active: HTMLLIElement | undefined;
        selected: HTMLLIElement | undefined;
      };
      optionList: OptionList;
    };
  }
) {
  const {
    nodesStatus: { active },
    optionList,
  } = action.payload;
  if (optionList.size() === 0) {
    return;
  }

  switch (action.type) {
    case "ArrowDown": {
      if (active === undefined) {
        const firstOption = optionList.first();
        if (!firstOption) break;

        dispatch((state) => ({ ...state, active: firstOption }));
        break;
      } else {
        const nextOption = optionList.next(active);

        if (!nextOption) break;

        dispatch((state) => ({ ...state, active: nextOption }));
      }
      break;
    }
    case "ArrowUp": {
      if (active === undefined) {
        const lastOption = optionList.last();
        if (!lastOption) break;

        dispatch((state) => ({ ...state, active: lastOption }));
        break;
      } else {
        const previousOption = optionList.prev(active);
        if (!previousOption) break;

        dispatch((state) => ({ ...state, active: previousOption }));
      }
      break;
    }
    case "Home": {
      const firstOption = optionList.first();
      if (!firstOption) break;

      dispatch((state) => ({ ...state, active: firstOption }));

      break;
    }
    case "End": {
      const lastOption = optionList.last();
      if (!lastOption) break;

      dispatch((state) => ({ ...state, active: lastOption }));
      break;
    }
    default: {
      return;
    }
  }
}
