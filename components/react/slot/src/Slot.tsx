import React from "react";

export default function Slot({ children }: React.PropsWithChildren) {
  React.isValidElement(children);
  /**
   * In svelte you have to add a <slot> to have children
   * The idea is that unnamed children are treated as any children,
   * but if any children with a specific name are used they are used as slot
   * The idea is to have compound components that also allow "replacing one component for another"
   * IE combobox uses Grid or Listbox or any other
   */
  return <>{children}</>;
}
