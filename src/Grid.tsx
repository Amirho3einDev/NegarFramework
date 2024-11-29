import React, { Component } from "react";
import axios from "axios";
import "./Grid.css"; // فایل CSS برای استایل‌دهی

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
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  // متد برای دریافت اطلاعات از API
  async fetchData() {
    const { apiUrl } = this.props;
    const { filters, currentPage, pageSize } = this.state;

    try {
      axios.post(apiUrl, {
        filters,
        page: currentPage,
        pageSize,
      }).then(response =>{

        console.log(response.data);
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
    const { data, currentPage, pageSize, totalRecords } = this.state;

    return (
      <div className="grid-container">
        <div className="grid-header">
          <h2>{title}</h2>
          <button
            className="btn btn-primary"
            onClick={() => (onAdd ? onAdd() : console.log("Add clicked"))}
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
                className={`page-button ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => this.changePage(index + 1)}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </div>
    );
  }
}

export default Grid;
