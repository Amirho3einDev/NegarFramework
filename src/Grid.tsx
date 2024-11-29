import React, { Component } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import "./Grid.css";

// تعریف اینترفیس ستون‌ها
interface ColumnModel {
  field: string;
  header: string;
  size?: string;
  isHide?: boolean;
  isFilterable?: boolean;
}

// تعریف اینترفیس Props گرید
interface GridProps {
  columns: ColumnModel[];
  apiUrl: string;
  title: string;
  FormComponent?: JSX.Element; // فرم به‌صورت JSX
}

// تعریف اینترفیس State گرید
interface GridState {
  data: any[];
  filters: { [key: string]: { operator: string; value: string } };
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  showDialog: boolean; // نمایش یا مخفی بودن دیالوگ
}

class Grid extends Component<GridProps, GridState> {
  constructor(props: GridProps) {
    super(props);
    this.state = {
      data: [],
      filters: {},
      totalRecords: 0,
      currentPage: 1,
      pageSize: 10,
      showDialog: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // متد برای دریافت داده‌ها از API
  async fetchData() {
    const { apiUrl } = this.props;
    const { filters, currentPage, pageSize } = this.state;

    try {
      const response = await axios.post(apiUrl, {
        filters,
        page: currentPage,
        pageSize,
      });

      this.setState({
        data: response.data.records,
        totalRecords: response.data.total,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // متد برای مدیریت تغییرات فیلترها
  onFilterChange(field: string, filterValue: { operator: string; value: string }) {
    const updatedFilters = { ...this.state.filters, [field]: filterValue };
    this.setState({ filters: updatedFilters }, () => this.fetchData());
  }

  // رندر کردن هدر گرید
  renderHeader() {
    const { title } = this.props;

    return (
      <div className="grid-header">
        <h2>{title}</h2>
        <Button
          label="Add"
          icon="pi pi-plus"
          className="p-button-success"
          onClick={() => this.setState({ showDialog: true })}
        />
      </div>
    );
  }

  // رندر کردن فیلترها برای ستون‌ها
  renderFilters(col: ColumnModel) {
    if (!col.isFilterable) return null;

    const currentFilter = this.state.filters[col.field] || { operator: "", value: "" };

    return (
      <div className="filter-container">
        <Dropdown
          value={currentFilter.operator}
          options={[
            { label: "LIKE", value: "LIKE" },
            { label: "=", value: "=" },
            { label: ">", value: ">" },
            { label: "<", value: "<" },
          ]}
          onChange={(e) =>
            this.onFilterChange(col.field, { operator: e.value, value: currentFilter.value })
          }
          placeholder="Operator"
          className="p-column-filter"
        />
        <InputText
          value={currentFilter.value}
          onChange={(e) =>
            this.onFilterChange(col.field, { operator: currentFilter.operator, value: e.target.value })
          }
          placeholder={`Search ${col.header}`}
        />
      </div>
    );
  }

  render() {
    const { columns, FormComponent } = this.props;
    const { data, totalRecords, currentPage, pageSize, showDialog } = this.state;

    return (
      <div className="grid-container">
        {this.renderHeader()}

        <DataTable
          value={data}
          paginator
          rows={pageSize}
          totalRecords={totalRecords}
          lazy
          onPage={(e: any) =>
            this.setState(
              { currentPage: e.page + 1, pageSize: e.rows },
              () => this.fetchData()
            )
          }
        >
          {columns.map((col) =>
            col.isHide ? null : (
              <Column
                key={col.field}
                field={col.field}
                header={col.header}
                style={{ width: col.size }}
                filter
                filterElement={this.renderFilters(col)}
              />
            )
          )}
        </DataTable>

        {/* دیالوگ فرم */}
        <Dialog
          visible={showDialog}
          onHide={() => this.setState({ showDialog: false })}
          header="Add New Record"
          modal
          style={{ width: "50vw" }}
        >
          {FormComponent && React.cloneElement(FormComponent, {
            onClose: () => this.setState({ showDialog: false }),
            onSave: (newData: any) => {
              console.log("Saved Data:", newData);
              this.setState({ showDialog: false });
              this.fetchData();
            },
          })}
        </Dialog>
      </div>
    );
  }
}

export default Grid;
