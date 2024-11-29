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
}

class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);

    this.state = {
      formData: { ...props.data },
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

  // ارسال فرم
  handleSubmit = () => { 
    this.props.onSubmit(this.state.formData);
  };

  render() {
    const { model } = this.props;
    const { formData } = this.state;

    return (
      <form>
        <div className="row">
          {model.fields.map((field: Field) => {
            if (!field.visible) return null;

            const isReadOnly =
              field.readonly ||
              (!field.insertable && !formData.id) ||
              (!field.updateable && formData.id);

            // رندر DetailGrid برای فیلدهای جزئیات
            if (field.isDetail && field.detailModel) {
              return (
                <div key={field.name} className={`form-group ${field.size || "col-12"}`}>
                  <label>{field.label}</label>
                  <DetailGrid
                    model={field.detailModel}
                    data={formData[field.name] || []}
                    onAdd={(newDetail) => this.handleDetailAdd(field.name, newDetail)}
                    onDelete={(index) => this.handleDetailDelete(field.name, index)}
                  />
                </div>
              );
            }

            // رندر فیلدهای معمولی
            return (
              <div key={field.name} className={`form-group ${field.size || "col-12"}`}>
                <label>{field.label}</label>
                {field.options ? (
                  // فیلدهای Lookup
                  <select
                    className="form-control"
                    value={formData[field.name] || ""}
                    onChange={(e) => this.handleFieldChange(field.name, e.target.value)}
                    disabled={isReadOnly}
                  >
                    <option value="">Select...</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  // فیلدهای معمولی
                  <input
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={(e) => this.handleFieldChange(field.name, e.target.value)}
                    className="form-control"
                    readOnly={isReadOnly}
                    required={field.isRequired}
                  />
                )}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="btn btn-primary mt-3"
          onClick={this.handleSubmit}
        >
          Save
        </button>
      </form>
    );
  }
}

export default Form;
