import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { Component } from "react";
import DetailGrid from "./DetailGrid";

interface Field {
  name: string;
  label: string;
  type?: string;
  visible?: boolean;
  insertable?: boolean;
  updateable?: boolean;
  size?: string; // کلاس‌های CSS مثل col-6
  readonly?: boolean;
  isRequired?: boolean;
  options?: any[]; // برای فیلدهای Lookup
  isDetail?: boolean; // مشخص می‌کند آیا این فیلد جزئیات است یا خیر
  detailModel?: any; // مدل مربوط به جزئیات
}

interface FormModel {
  fields: Field[];
}

interface FormProps {
  model: FormModel;
  data: any;
  onSubmit: (data: any) => void;
}

interface FormState {
  formData: any;
  errors: { [key: string]: string }
}

class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);

    this.state = {
      formData: { ...props.data },
      errors: {},
    };
  }

  // دسترسی به مقدار هر فیلد
  get form() {
    const proxy = new Proxy(this.state.formData, {
      get: (target, prop) => target[prop as string],
      set: (target, prop, value) => {
        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            [prop as string]: value,
          },
        }));
        return true;
      },
    });
    return proxy;
  }

  // مدیریت تغییر مقدار فیلد 
  handleFieldChange = (field: string, value: any) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [field]: value,
      },
      errors: {
        ...prevState.errors,
        [field]: "", // پاک کردن خطا در صورت تغییر مقدار
      },
    }));
  };

  // مدیریت جزئیات (افزودن به آرایه جزئیات)
  handleDetailAdd = (fieldName: string, newDetail: any) => {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [fieldName]: [...(prevState.formData[fieldName] || []), newDetail],
      },
    }));
  };

  // مدیریت حذف جزئیات
  handleDetailDelete = (fieldName: string, index: number) => {
    this.setState((prevState) => {
      const updatedDetails = [...(prevState.formData[fieldName] || [])];
      updatedDetails.splice(index, 1);
      return {
        formData: {
          ...prevState.formData,
          [fieldName]: updatedDetails,
        },
      };
    });
  };

  // مدیریت ویرایش جزئیات
  handleDetailEdit = (fieldName: string, index: number) => {
    const detailData = this.state.formData[fieldName][index];
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [fieldName]: [...(prevState.formData[fieldName] || []), detailData],
      },
    }));
  };

  validateForm = () => {
    const { model } = this.props;
    const { formData } = this.state;
    const errors: { [key: string]: string } = {};

    model.fields.forEach((field) => {
      if (field.isRequired && !formData[field.name]) {
        errors[field.name] = `${field.label} is required`;
      }
    });

    return errors;
  };
  // ارسال فرم
  handleSubmit = (event: any) => {
    //this.props.onSubmit(this.state.formData);
    event.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length === 0) {
      this.props.onSubmit(this.state.formData);
    } else {
      this.setState({ errors });
    }
  };

  render() {
    const { model } = this.props;
    const { formData, errors } = this.state;

    return (
      <Card title="Form" className="p-4">
        <form>
          <div className="p-fluid grid">
            {model.fields.map((field: Field) => {
              if (!field.visible) return null;

              const hasError = errors[field.name];

              const isReadOnly =
                field.readonly ||
                (!field.insertable && !formData.id) ||
                (!field.updateable && formData.id);

              if (field.isDetail && field.detailModel) {
                return (
                  <div key={field.name} className={field.size || "col-12"}>
                    <label>
                      {field.label}
                      {field.isRequired && <span className="text-danger">*</span>}
                    </label>
                    <DetailGrid
                      model={field.detailModel}
                      data={formData[field.name] || []}
                      onAdd={(newDetail) => this.handleDetailAdd(field.name, newDetail)}
                      onDelete={(index) => this.handleDetailDelete(field.name, index)}
                      onEdit={(index) => this.handleDetailEdit(field.name, index)}
                    />
                  </div>
                );
              }

              return (
                <div key={field.name} className={field.size || "col-12"}>
                  <label className="mb-2">
                    {field.label}
                    {field.isRequired && <span className="text-danger">*</span>}
                  </label>
                  {field.options ? (
                    <Dropdown
                      value={formData[field.name] || ""}
                      options={field.options}
                      onChange={(e) => this.handleFieldChange(field.name, e.value)}
                      placeholder="Select"
                      disabled={isReadOnly}
                      className={`w-full ${hasError ? 'p-invalid' : ''}`}
                    />
                  ) : (
                    <InputText
                      value={formData[field.name] || ""}
                      onChange={(e) =>
                        this.handleFieldChange(field.name, e.target.value)
                      }
                      type={field.type || "text"}
                      className={`w-full ${isReadOnly ? "readonly-input" : ""}`}
                      readOnly={isReadOnly}
                      required={field.isRequired}
                    />
                  )}
                  {hasError && <div className="p-error">{errors[field.name]}</div>}
                </div>
              );
            })}
          </div>
          <div className="flex justify-content-end mt-4">
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={this.handleSubmit}
              type="button"
              className="p-button-success"
            />
          </div>
        </form>
      </Card>
    );
  }
}

export default Form;
