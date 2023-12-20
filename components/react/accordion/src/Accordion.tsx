import * as React from "react";

export interface AccordionProps {
  greetings: string;
}

export const Accordion = ({ greetings }: AccordionProps) => {
  return <div>Accordion: {greetings}!!!?abb</div>;
};
