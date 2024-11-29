import React, { Component } from 'react';
import { Dialog } from 'primereact/dialog';
import Form from './Form';

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
      acc[field.name] = '';
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

  render() {
    const { model, data } = this.props;
    const { showDialog, newDetail } = this.state;

    return (
      <div>
        <table className="table">
          <thead>
            <tr>
              {model.fields.map(
                (field: any) =>
                  field.visible && <th key={field.name}>{field.label}</th>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {model.fields.map(
                  (field: any) =>
                    field.visible && <td key={field.name}>{row[field.name]}</td>
                )}
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => this.handleDelete(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="btn btn-primary mt-2"
          onClick={() => this.setState({ showDialog: true })}
        >
          Add Detail
        </button>

        <Dialog
          header="Add Detail"
          visible={showDialog}
          onHide={() => this.setState({ showDialog: false })}
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
