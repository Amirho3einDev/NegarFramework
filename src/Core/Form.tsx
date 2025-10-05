import axios from "axios";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { Component, createRef } from "react";
import DetailGrid from "./DetailGrid";
import { FormProps } from "./DTOs/FormProps";
import InputCheckbox from "./InputCheckbox";
import Lookup from "./Lookup";
import LookupFactory from "./LookupFactory";
import "./Form.css";


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

interface FormState {
  formData: any;
  errors: { [key: string]: string }
  fieldRefs: { [key: string]: React.RefObject<any> };
  readonlyStatus: { [key: string]: boolean }; // وضعیت readonly برای هر فیلد

}

class Form extends Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props);

    const model = this.getModel();
    // ایجاد Refها برای فیلدها
    const fieldRefs = model.fields.reduce((refs: any, field: Field) => {
      refs[field.name] = createRef();
      return refs;
    }, {});

    // مقدار اولیه readonlyStatus
    const readonlyStatus = model.fields.reduce((status: any, field: Field) => {
      status[field.name] = field.readonly || false;
      return status;
    }, {});


    this.state = {
      formData: this.getData(null),
      errors: {},
      fieldRefs,
      readonlyStatus
    };
  }

  getModel(): FormModel {
    const formModel: FormModel = {
      fields: [

      ],
    };

    return formModel;
  }

  protected getApiUrl(): string {
    return "";
  }

  async fetchData() {
    const apiUrl = this.getApiUrl();

    try {
      const response = await axios.post(apiUrl, {
        EntityId: this.props.selectedEntity?.id
      });

      return response.data;

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  async getData(entityId: any) {
    // return {
    //   id: 1, name: 'Amirho3ein', email: 'MyEmail@getMaxListeners.Com', IsActive: false, details: [
    //     { productName: 'Product1', quantity: 1 },
    //     { productName: 'Product23', quantity: 6 },
    //   ]
    // };
    var data = await this.fetchData();
    return data;

  }

  // دسترسی به مقدار و Ref هر فیلد از طریق Proxy
  //  get form() {
  //   const proxy = new Proxy(this.state.formData, {
  //     get: (target, prop) => {
  //       const ref = this.state.fieldRefs[prop as string];
  //       return {
  //         value: target[prop as string],
  //         element: ref ? ref.current : null, // دسترسی به المان DOM
  //       };
  //     },
  //     set: (target, prop, value) => {
  //       this.setState((prevState) => ({
  //         formData: {
  //           ...prevState.formData,
  //           [prop as string]: value,
  //         },
  //       }));
  //       return true;
  //     },
  //   });
  //   return proxy;
  // }

  get form() {
    const { formData, readonlyStatus, fieldRefs } = this.state;
    const self = this; // ارجاع به this
    const proxy = new Proxy(
      this.state.formData,
      {
        get: (target, prop) => {
          if (prop in formData) {
            return {
              get value(): any {
                return formData[prop as string];
              },
              set value(newValue) {
                self.handleFieldChange(prop as string, newValue);
              },
              get readonly() {
                return readonlyStatus[prop as string];
              },
              set readonly(newValue: boolean) {
                self.setReadonlyStatus(prop as string, newValue);
              },
              get element() {
                return fieldRefs[prop as string]?.current || null;
              },
            };
          }
          return undefined;
        },
      }
    );

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

  setReadonlyStatus = (field: string, value: boolean) => {
    this.setState((prevState) => ({
      readonlyStatus: {
        ...prevState.readonlyStatus,
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

  protected isNew(){
    return this.props.selectedEntity ? false : true;
  }

  onOpen = () => {
    const entityId = this.props.selectedEntity?.id; 
    const loadFromApi = this.props.loadFromApi; 

    if( this.isNew())
    {
      return;
    }

    if(loadFromApi!=null && !loadFromApi)
    {
      this.setState({ formData: this.props.selectedEntity });
      return;
    }
    if (entityId != null) {
      this.getData(entityId).then(data => {
        this.setState({ formData: data });
      });
    }
  }

  validateForm = () => {
    // const { model } = this.props; 
    const model = this.getModel();
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

  componentDidMount() {
    this.onOpen();
  }

  render() {


    // const { model } = this.props;
    const model = this.getModel();
    const { formData, errors, fieldRefs, readonlyStatus } = this.state;

    return (
      // <Card title="Form" className="p-4">
      <form>
        <div className="p-fluid grid">
          {model.fields.map((field: Field) => {
            if (!field.visible) return null;

            const isReadOnly = readonlyStatus[field.name];

            const hasError = errors[field.name];

            // const isReadOnly =
            //   field.readonly ||
            //   (!field.insertable && !formData.id) ||
            //   (!field.updateable && formData.id);

            if (field.isDetail && field.detailModel) {
              return (
                <div key={field.name} className={field.size || "col-12"}>
                  <label>
                    {/* {field.label} */}
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
            if (field.type === "boolean") {

              return (
                <div key={field.name} className={field.size || "col-12"}>
                  <label>
                    {field.label}
                  </label>
                  <InputCheckbox
                    value={formData[field.name] || false}
                    onChange={(value) => this.handleFieldChange(field.name, value)}
                    disabled={false}
                  />
                </div>
              )
            }
            if (field.type === "Date" || field.type === "DateTime") {
              return (
                <div key={field.name} className={field.size || "col-12"}>
                  <label>
                    {field.label}
                    {field.isRequired && <span className="text-danger">*</span>}
                  </label>
                  <Calendar
                    value={formData[field.name] || null}
                    onChange={(e) =>
                      this.handleFieldChange(field.name, e.value)
                    }
                    showTime={field.type === "DateTime"}
                    showSeconds={field.type === "DateTime"}
                    dateFormat="yy-mm-dd"
                    placeholder=""
                    inputClassName="custom-input"
                    className={`w-full ${hasError ? "p-invalid" : ""}`}
                  />
                  {hasError && <div className="p-error">{errors[field.name]}</div>}
                </div>
              );
            }

            if (field.type === "lookup") {
              const look = LookupFactory.getLookupComponent(field.name);

              if (!look) {
                console.error(`Lookup component not found for: ${field.name}`);
                return null;
              }
              return (
                <div key={field.name} className={field.size || "col-12"}>
                  <label>
                    {field.label}
                    {field.isRequired && <span className="text-danger">*</span>}
                  </label>
                  {React.createElement(look, {
                    value: this.state.formData[field.name],
                    onChange: (newValue: any) =>
                      this.setState({ formData: { ...this.state.formData, [field.name]: newValue } }),

                  })}
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
                    ref={fieldRefs[field.name]}
                    value={formData[field.name] || ""}
                    options={field.options}
                    onChange={(e) => this.handleFieldChange(field.name, e.value)}
                    placeholder="Select"
                    disabled={isReadOnly}
                    className={`w-full custom-input ${hasError ? 'p-invalid' : ''}`}
                  />
                ) : (

                  <InputText
                    ref={fieldRefs[field.name]}
                    value={formData[field.name] || ""}
                    onChange={(e) =>
                      this.handleFieldChange(field.name, e.target.value)
                    }
                    type={field.type || "text"}
                    className={`w-full custom-input ${isReadOnly ? "readonly-input" : ""}`}
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
            className="p-button-success custom-button"
          />
        </div>
      </form>
      // </Card>
    );
  }
}

export default Form;
