import React from "react";
import ColumnModel from "../../Core/DTOs/ColumnModel";
import Form from "../../Core/Form";
import Grid from "../../Core/Grid";

class MyUserGridComponent extends Grid {
    constructor(props: any) {
        super(props);
        // ویژگی‌های خاص UserGridComponent می‌توانند در اینجا تعریف شوند
        // this.state = {
        //     ...this.state,
        //     // می‌توان مقادیر پیش‌فرض خاص این کامپوننت را تغییر داد
        //     data: [], // داده‌های پیش‌فرض برای کاربران
        // };
    }

    getColumns(): ColumnModel[] {
        const columns: ColumnModel[] = [
            { field: "id", header: "ID", size: "col-2", isFilterable: true },
            { field: "name", header: "Name", size: "col-4", isFilterable: true },
            { field: "email", header: "Email", size: "col-4", isFilterable: true },
            { field: "age", header: "Age", size: "col-1", isFilterable: true },
            { field: "IsActive", header: "Age", size: "col-1", isFilterable: true },
        ];
        return columns;
    }

    getTitle(): string {
        return "Title";
    }

    getApiUrl(): string {
        return "https://localhost:7293/api/users";
    }


    getFormComponent(): JSX.Element | null {
    
        return <Form 
            // data={{
            //     id: 1, name: 'Amirho3ein', email: 'MyEmail@getMaxListeners.Com', details: [
            //         { productName: 'Product1', quantity: 1 },
            //         { productName: 'Product23', quantity: 6 },
            //     ]
            // }}
            // onSubmit={(data: any) => this.handleAdd(data)}
            onSubmit={(data: any) => { }} />;
    }


    // render() {



    //     return (
    //         <div>
    //             <Grid
    //                 title={this.getTitle()}
    //                 apiUrl={this.getApiUrl()}
    //                 columns={this.getColumns()}
    //                 FormComponent={}
    //             //onAdd={this.handleAdd}  // متد برای افزودن رکورد جدید
    //             />
    //         </div>
    //     );
    // }

    // متد برای اضافه کردن داده جدید
    handleAdd = () => {
        console.log("Add button clicked in UserGrid");
        // کد برای باز کردن فرم اضافه کردن کاربر
    };
}

export default MyUserGridComponent;
