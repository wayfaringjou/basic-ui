import * as React from "react";

type Ref = HTMLDivElement;

const Group = React.forwardRef<Ref, React.ComponentPropsWithoutRef<"div">>(
  ({ children, ...props }, ref) => {
    return (
      <div {...props} ref={ref} role="group">
        {children}
      </div>
    );
  }
);

Group.displayName = "Listbox.Group";
export default Group;
