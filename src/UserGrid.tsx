import React from "react";
import Grid from "./Grid";

class UserGridComponent extends React.Component {
  constructor(props: any) {
    super(props);
    // ویژگی‌های خاص UserGridComponent می‌توانند در اینجا تعریف شوند
    this.state = {
      ...this.state,
      // می‌توان مقادیر پیش‌فرض خاص این کامپوننت را تغییر داد
      data: [], // داده‌های پیش‌فرض برای کاربران
    };
  }

  render() {
    const columns = [
      { field: "id", header: "ID", size: "col-2", isFilterable: true },
      { field: "name", header: "Name", size: "col-4", isFilterable: true },
      { field: "email", header: "Email", size: "col-4", isFilterable: true },
      { field: "age", header: "Age", size: "col-2", isFilterable: true },
    ];

    return (
      <div>
            <Grid
          title="User List"
          apiUrl="https://localhost:7293/api/users"
          columns={columns} 
          onAdd={this.handleAdd}  // متد برای افزودن رکورد جدید
        />
      </div>
    );
  }

  // متد برای اضافه کردن داده جدید
  handleAdd = () => {
    console.log("Add button clicked in UserGrid");
    // کد برای باز کردن فرم اضافه کردن کاربر
  };
}

export default UserGridComponent;
