import Form from "../../Core/Form";

class UserForm extends Form {
    constructor(props: any) {
      super(props);
    }

    protected getApiUrl(): string {
      return "https://localhost:7293/api/GetUser";
    }
}
 
export default UserForm;