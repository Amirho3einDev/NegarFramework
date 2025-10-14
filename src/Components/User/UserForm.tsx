import Form from "../../Core/Form";

class UserForm extends Form {
    constructor(props: any) {
      super(props);
    }

    protected getApiUrl(): string {
      return "https://localhost:7293/api/GetUser";
    }

    getModel()  {
      const formModel = {
        fields: [
          { name: "name", label: "Name", size: 'col-6', visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
          { name: "family", label: "family", size: 'col-6', visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
          { name: "email", label: "Email", size: 'col-6', visible: true, type: "text", isRequired: true, insertable: true, updateable: true, readonly: true },
          { name: "Address", label: "Email", size: 'col-6', visible: true, type: "text", isRequired: true, insertable: true, updateable: true, readonly: true },
          { name: "CreateDate", label: "CreateDate", size: 'col-6', visible: true, type: "Date", isRequired: true, insertable: true, updateable: true, readonly: true },
          { name: "IsActive", label: "Is Active?", size: 'col-6', visible: true, type: "boolean", isRequired: true, insertable: true, updateable: true, readonly: true },
          { name: "RequestDate", label: "RequestDate", size: 'col-6', visible: true, type: "DateTime", isRequired: true, insertable: true, updateable: true, readonly: true },
          { name: "UserLookup", label: "UserLookup", size: 'col-6', visible: true, type: "lookup", isRequired: true, insertable: true, updateable: true, readonly: true },
          {
            name: "details",
            label: "Order Details",
            visible: true,
            isDetail: true,
            detailModel: {
              FormName:"ProductDetailForm",
              fields: [
                { name: "productName", label: "Product Name", size: 'col-6', visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
                { name: "quantity", label: "Quantity", size: 'col-6', type: "number", visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
              ],
            },
          },
        ],
      };
  
      return formModel;
    }
}
 
export default UserForm;