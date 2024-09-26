import { IOption } from "@/components/ui/Dropdown";
import { INPUT_TYPES } from "@/index-types";
import { Control } from "react-hook-form";

export interface IFormField {
  control: Control<any>;
  inputType: INPUT_TYPES;
  label: string;
  placeholder?: string;
  name: string;
  options?: IOption[];
}
