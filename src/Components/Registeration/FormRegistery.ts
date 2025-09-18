import React from "react";
import { FormProps } from "../../Core/DTOs/FormProps";
import Form from "../../Core/Form";
import ProductDetailForm from "../User/ProductDetailForm";
import UserForm from "../User/UserForm";

  
const FormRegistery: Record<string, React.LazyExoticComponent<React.ComponentType<FormProps>>> = {
   ProductDetailForm: React.lazy(() => import("../User/ProductDetailForm")),
   UserForm: React.lazy(() => import("../User/ProductDetailForm")),
 };
  
 export default FormRegistery;