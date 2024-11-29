import ColumnModel from "./ColumnModel";

// تعریف اینترفیس Props گرید
export default interface GridProps {
    columns: ColumnModel[];
    apiUrl: string;
    title: string;
    FormComponent?: JSX.Element; // فرم به‌صورت JSX
  }