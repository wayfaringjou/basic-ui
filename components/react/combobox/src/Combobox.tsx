import * as React from "react";

export type InputProps = React.JSX.IntrinsicElements["input"];

export const Input = ({
  type = "text",
  role = "combobox",
  ...inputProps
}: InputProps) => {
  // This is a wrapper for the input element. It will default to a text input

  return <input type={type} role={role} {...inputProps} />;
};

Input.displayName = "ComboboxInput";

export type ListBoxProps = React.PropsWithChildren;

export const ListBox = () => {
  return (
    <ul>
      <li></li>
    </ul>
  );
};

export const Grid = () => {
  return <dt></dt>;
};

export type PopupProps = React.PropsWithChildren;

export const Popup = ({ children }: PopupProps) => {
  // This is a wrapper for the popup element

  return <div>{children}</div>;
};

Input.displayName = "ComboboxPopup";

export type ComboboxProps = React.PropsWithChildren;

const Combobox = ({ children }: ComboboxProps) => {
  // This is a wrapper that provides stuff
  //const [] = useCombobox();
  return <>{children}</>;
};

Combobox.displayName = "Combobox";

export default Object.assign(Combobox, { Input, Popup, ListBox });
