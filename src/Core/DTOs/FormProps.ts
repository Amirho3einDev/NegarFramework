import BaseEntity from "./BaseEntity";

export interface FormProps {
  //model: FormModel;
  //data: any;
  loadFromApi?:boolean | null;
  selectedEntity: BaseEntity | null;
  isNew?:boolean;
  onSubmit: (data: any) => void;
}
