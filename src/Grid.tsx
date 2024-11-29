import React, { Component } from "react";
import axios from "axios";
import "./Grid.css"; // فایل CSS برای استایل‌دهی
import Form from "./Form";
import { Dialog } from "primereact/dialog";
import { getMaxListeners } from "process";

// تعریف اینترفیس برای مدل ستون‌ها
interface ColumnModel {
  field: string;
  header: string;
  size?: string; // کلاس‌های CSS مانند col-6
  isHide?: boolean;
  isFilterable?: boolean;
}

// تعریف اینترفیس برای props کامپوننت Grid
interface GridProps {
  columns: ColumnModel[];
  apiUrl: string; // URL API برای دریافت اطلاعات
  title: string; // عنوان گرید
  onAdd?: () => void; // قابلیت Override برای دکمه Add
}

// تعریف اینترفیس برای state کامپوننت Grid
interface GridState {
  data: any[]; // داده‌های دریافت شده از API
  filters: { [key: string]: { value: any; operator: string } }; // فیلترهای اعمال شده
  currentPage: number; // صفحه فعلی
  pageSize: number; // تعداد آیتم‌های هر صفحه
  totalRecords: number; // تعداد کل رکوردها
  isFormOpen: boolean,
  editingRecord: any
}

class Grid extends Component<GridProps, GridState> {
  constructor(props: GridProps) {
    super(props);
    this.state = {
      data: [],
      filters: {},
      currentPage: 1,
      pageSize: 10,
      totalRecords: 0,
      isFormOpen: false,
      editingRecord: {}
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  

  // متد برای دریافت اطلاعات از API
  async fetchData() {
    const { apiUrl } = this.props;
    const { filters, currentPage, pageSize} = this.state;

    try {
      axios.post(apiUrl, {
        filters,
        page: currentPage,
        pageSize,
      }).then(response => {

         this.setState({
          data: response.data.records,
          totalRecords: response.data.total,
        });
      });

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // متد برای اعمال فیلتر
  applyFilter(field: string, value: any, operator: string) {
    const newFilters = { ...this.state.filters };
    newFilters[field] = { value, operator };
    this.setState({ filters: newFilters }, () => this.fetchData());
  }

  // متد برای تغییر صفحه
  changePage(newPage: number) {
    this.setState({ currentPage: newPage }, () => this.fetchData());
  }

  render() {
    const { columns, title, onAdd } = this.props;
    const { data, currentPage, pageSize, totalRecords,isFormOpen,editingRecord  } = this.state;

    // const ProductModel = {
    //   name: 'Product',
    //   fields: [
    //     { name: 'id', label: 'ID', type: 'number', insertable: false, updateable: false, visible: true, readonly: true },
    //     { name: 'name', label: 'Name', type: 'text', insertable: true, updateable: true, visible: true, isRequired: true },
    //     { name: 'price', label: 'Price', type: 'number', insertable: true, updateable: true, visible: true },
    //   ],
    //   details: {
    //     label: 'Variants',
    //     fields: [
    //       { name: 'id', label: 'ID', type: 'number', insertable: false, updateable: false, visible: true },
    //       { name: 'color', label: 'Color', type: 'text', insertable: true, updateable: true, visible: true },
    //       { name: 'size', label: 'Size', type: 'text', insertable: true, updateable: true, visible: true },
    //     ],
    //   },
    // };

    const formModel = {
      fields: [
        { name: "name", label: "Name", visible: true, isRequired: true,insertable:true,updateable:true,readonly:false },
        { name: "email", label: "Email", visible: true, type: "email" },
        {
          name: "details",
          label: "Order Details",
          visible: true,
          isDetail: true,
          detailModel: {
            fields: [
              { name: "productName", label: "Product Name", visible: true },
              { name: "quantity", label: "Quantity", type: "number", visible: true },
            ],
          },
        },
      ],
    };

    return (
      <div className="grid-container">
        <div className="grid-header">
          <h2>{title}</h2>
          <button
            className="btn btn-primary"
            onClick={() => ( this.setState({ isFormOpen: true }))}
          >
            Add
          </button>
        </div>

        <table className="grid-table">
          <thead>
            <tr>
              {columns.map((col) =>
                col.isHide ? null : (
                  <th key={col.field} style={{ width: col.size }}>
                    {col.header}
                    {col.isFilterable && (
                      <div className="filter-container">
                        <select
                          onChange={(e) =>
                            this.applyFilter(col.field, "", e.target.value)
                          }
                        >
                          <option value="">Select Operator</option>
                          <option value="LIKE">LIKE</option>
                          <option value="=">=</option>
                          <option value="<">&lt;</option>
                          <option value=">">&gt;</option>
                        </select>
                        <input
                          type="text"
                          placeholder={`Filter ${col.header}`}
                          onChange={(e) =>
                            this.applyFilter(
                              col.field,
                              e.target.value,
                              this.state.filters[col.field]?.operator || "="
                            )
                          }
                        />
                      </div>
                    )}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((col) =>
                  col.isHide ? null : <td key={col.field}>{row[col.field]}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from(
            { length: Math.ceil(totalRecords / pageSize) },
            (_, index) => (
              <button
                key={index + 1}
                className={`page-button ${currentPage === index + 1 ? "active" : ""
                  }`}
                onClick={() => this.changePage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>

           {/* فرم ایجاد/ویرایش */ }
    {
      isFormOpen && (


        <Dialog
        header="Add Detail"
        visible={isFormOpen}
        onHide={() => this.setState({ isFormOpen: false })}
      >
        <Form
          model={formModel}
          data={{id:1,name:'Amirho3ein',email:'MyEmail@getMaxListeners.Com'}}
          // onSubmit={(data: any) => this.handleAdd(data)}
          onSubmit={(data: any) => {}}
        />
      </Dialog>
        
      )

      // <div className="form-dialog">
      //     <Form
      //       data={editingRecord}
      //       onClose={() => this.closeForm()}
      //       onSave={() => {
      //         this.fetchData();
      //         this.closeForm();
      //       }}
      //     />
      //   </div>
    }
      </div>
 
    );
  }
}

export default Grid;
