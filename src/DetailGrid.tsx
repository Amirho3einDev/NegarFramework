import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Form from "./Form";

interface DetailGridProps {
  model: any;
  data: any[];
  onAdd: (newDetail: any) => void;
  onDelete: (index: number) => void;
}

interface DetailGridState {
  showDialog: boolean;
  newDetail: any;
}

class DetailGrid extends Component<DetailGridProps, DetailGridState> {
  constructor(props: DetailGridProps) {
    super(props);

    this.state = {
      showDialog: false,
      newDetail: this.initializeNewDetail(props.model),
    };
  }

  initializeNewDetail = (model: any) => {
    return model.fields.reduce((acc: any, field: any) => {
      acc[field.name] = "";
      return acc;
    }, {});
  };

  handleAdd = (data: any) => { 
    this.props.onAdd(data);
    this.setState({
      showDialog: false,
      newDetail: this.initializeNewDetail(this.props.model),
    });
  };

  handleDelete = (index: number) => {
    this.props.onDelete(index);
  };

  renderActions = (_: any, { rowIndex }: any) => {
    return (
      <Button
        icon="pi pi-trash"
        type="button" // جلوگیری از رفتار submit
        className="p-button-rounded p-button-outlined p-button-danger"
        onClick={() => this.handleDelete(rowIndex)}
        tooltip="Delete"
      />
    );
  };

  render() {
    const { model, data } = this.props;
    const { showDialog, newDetail } = this.state; 
    return (
      <div className="p-card p-shadow-3 p-p-3">
        <h3 className="p-text-secondary" style={{ marginBottom: "20px" }}>
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
            onClick={() => this.setState({ showDialog: true })}
          />
        </div>

        {/* جدول داده‌ها */}
        <DataTable
          value={data}
          className="p-datatable-sm p-datatable-gridlines p-datatable-striped"
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
          header={
            <div className="p-d-flex p-ai-center p-jc-between">
              <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                Add New Detail
              </span>
            </div>
          }
          visible={showDialog}
          style={{ width: "50vw" }}
          modal
          onHide={() => this.setState({ showDialog: false })}
          footer={
            <div className="p-d-flex p-jc-start">
              <Button
                label="Close"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() => this.setState({ showDialog: false })}
              />
            </div>
          }
        >
          <Form
            model={model}
            data={newDetail}
            onSubmit={(data: any) => this.handleAdd(data)}
          />
        </Dialog>
      </div>
    );
  }
}

export default DetailGrid;
