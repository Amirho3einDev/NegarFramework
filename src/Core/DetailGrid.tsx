import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import FormRegistry from "../Components/Registeration/FormRegistery";
import Form from "./Form";

interface DetailGridProps {
  model: any;
  data: any[];
  onAdd: (newDetail: any) => void;
  onDelete: (index: number) => void;
  onEdit: (index: number, detail: any) => void;
}

interface DetailGridState {
  showDialog: boolean;
  newDetail: any;
  selectedDetail: any | null; // برای نگهداری جزئیاتی که در حال ویرایش است
  selectedIndex: number | null;
}

class DetailGrid extends Component<DetailGridProps, DetailGridState> {
  constructor(props: DetailGridProps) {
    super(props);

    this.state = {
      showDialog: false,
      newDetail: this.initializeNewDetail(props.model),
      selectedDetail: null,
      selectedIndex: null,
    };
  }

  initializeNewDetail = (model: any) => {
    return model.fields.reduce((acc: any, field: any) => {
      acc[field.name] = "";
      return acc;
    }, {});
  };

  handleAdd = (data: any) => {

    if (this.state.selectedIndex !== null) {
      // ویرایش جزئیات
      console.log('edit');
      this.props.onEdit(this.state.selectedIndex, data);
    } else {
      // افزودن جزئیات جدید
      console.log('edit');
      this.props.onAdd(data);
    }

    this.setState({
      showDialog: false,
      newDetail: this.initializeNewDetail(this.props.model),
    });
  };

  handleEdit = (index: number) => {
    this.setState({
      showDialog: true,
      selectedDetail: this.props.data[index],
      selectedIndex: index,
    });
    console.log(this.props.data[index]); 
    console.log(index); 
  };

  handleDelete = (index: number) => {
    this.props.onDelete(index);
  };

  renderActions = (_: any, { rowIndex }: any) => {
    return (
      <>
        <div className="flex justify-content-center gap-2">
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text p-button-warning custom-button"
            onClick={() => this.handleEdit(rowIndex)}
            tooltip="Edit"
          />
          <Button
            icon="pi pi-trash"
            className="p-button-rounded p-button-text p-button-danger custom-button"
            onClick={() => this.handleDelete(rowIndex)}
            tooltip="Delete"
          />
        </div>
         
      </>


    );
  };

  render() {
    const { model, data } = this.props;
    const { showDialog, newDetail, selectedDetail } = this.state; 
    const FormComponent = FormRegistry[model.FormName];
    if (!FormComponent) return <div>فرم "{model.FormName}" پیدا نشد</div>;
console.log(selectedDetail);
    return (
      <div className="p-card p-shadow-3 p-p-3 pr-2">
        <h3 className="p-text-secondary" style={{ marginBottom: "20px",paddingTop:"10px " }}>
          Detail Grid
        </h3>

        {/* دکمه افزودن جزئیات */}
        <div className="p-d-flex p-jc-end p-mt-3">
          <Button
            label="Add Detail"
            icon="pi pi-plus"
            className="p-button-primary"
            type="button" // جلوگیری از رفتار submit
            style={{ width: "150px" }}
            onClick={() => this.setState({ showDialog: true, selectedDetail: null })}
          />
        </div>

        {/* جدول داده‌ها */}
        <DataTable
          value={data}
          className="p-datatable-sm p-datatable-gridlines p-datatable-striped pt-4"
          responsiveLayout="scroll"
        // paginator
        // rows={5}
        >
          {model.fields.map(
            (field: any) =>
              field.visible && (
                <Column
                  key={field.name}
                  field={field.name}
                  header={field.label}
                  style={{ textAlign: "center" }}
                />
              )
          )}
          <Column
            body={this.renderActions}
            header="Actions"
            style={{ width: "100px", textAlign: "center" }}
          />
        </DataTable>


        

        {/* دیالوگ افزودن جزئیات */}
        <Dialog
          // header={
          //   <div className="p-d-flex p-ai-center p-jc-between">
          //     <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          //       Add New Detail
          //     </span>
          //   </div>
          // }
          header={selectedDetail ? "Edit Detail" : "Add Detail"}

          visible={showDialog}
          style={{ width: "50vw" }}
          modal
          onHide={() =>
            this.setState({ showDialog: false, selectedDetail: null })
          }
          // footer={
          //   <div className="p-d-flex p-jc-start">
          //     <Button
          //       label="Close"
          //       icon="pi pi-times"
          //       className="p-button-text"
          //       onClick={() => this.setState({ showDialog: false })}
          //     />
          //   </div>
          // }
        > 

<FormComponent
        
        onSubmit={(data: any) => this.handleAdd(data)}
        selectedEntity={this.state.selectedDetail}
        loadFromApi={false}
       />
        </Dialog>
      </div>
    );
  }
}

export default DetailGrid;
