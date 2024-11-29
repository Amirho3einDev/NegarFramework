import React, { useState } from "react";
import Form from "./Core/Form";
/*
const App = () => {
  // مدل فرم
  const formModel = {
    fields: [
      { name: "name", label: "Name", visible: true, isRequired: true },
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

  // داده‌های اولیه فرم
  const formData = {
    name: "",
    email: "",
    details: [],
  };

  const handleSubmit = (data: any) => {
    console.log("Submitted Data:", data);
  };

  return (
    <div className="container mt-5">
      <h1>Master-Detail Form</h1>
      <Form model={formModel} data={formData} onSubmit={handleSubmit} />
    </div>
  );
};
*/
 
import UserGridComponent from "./Components/User/UserGrid";
import MyUserGridComponent from "./Components/User/MyUserGrid";

const App = () => {

  const gridModel = [
    { field: "id", header: "ID", size: "col-2", isFilterable: true, isHide: false },
    { field: "name", header: "Name", size: "col-4", isFilterable: true, isHide: false },
    { field: "age", header: "Age", size: "col-2", isFilterable: true, isHide: false },
    { field: "email", header: "Email", size: "col-4", isFilterable: true, isHide: false },
  ];

  const [data, setData] = useState([
    { id: 1, name: "John Doe", age: 25, email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", age: 30, email: "jane.smith@example.com" },
    { id: 3, name: "Sam Wilson", age: 22, email: "sam.wilson@example.com" },
    { id: 4, name: "Sara Connor", age: 28, email: "sara.connor@example.com" },
    { id: 5, name: "Michael Brown", age: 35, email: "michael.brown@example.com" },
  ]);

  // متد ذخیره داده جدید
  const handleAddData = (newRecord: any) => {
    setData([...data, { ...newRecord, id: data.length + 1 }]);
  };

  return (
    <div className="App">
      <h1>React Grid Example</h1>
      <MyUserGridComponent />
    </div>
  );
};

export default App;
