import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components";
import * as SelectPrimitive from "@radix-ui/react-select";
import { twMerge } from "tailwind-merge";
import { Label } from "../label";

export interface IOption {
  label: string;
  value: string;
}

interface IProps {
  label?: string;
  placeholder?: string;
  options: IOption[];
  SelectProps?: SelectPrimitive.SelectProps;
  SelectTriggerProps?: SelectPrimitive.SelectTriggerProps;
  SelectValueProps?: SelectPrimitive.SelectValueProps;
  SelectContentProps?: SelectPrimitive.SelectContentProps;
  SelectItemProps?: SelectPrimitive.SelectItemProps;
}

const Dropdown = ({
  label,
  placeholder,
  options,
  SelectContentProps,
  SelectItemProps,
  SelectProps,
  SelectTriggerProps,
  SelectValueProps,
}: IProps) => {
  return (
    <div className={twMerge("flex flex-col gap-2")}>
      {label && <Label>{label}</Label>}

      <Select {...SelectProps}>
        <SelectTrigger {...SelectTriggerProps}>
          <SelectValue placeholder={placeholder} {...SelectValueProps} />
        </SelectTrigger>
        <SelectContent {...SelectContentProps}>
          {options.map(({ label, value }) => {
            if (!value) return null;
            return (
              <SelectItem key={value} value={value} {...SelectItemProps}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Dropdown;
