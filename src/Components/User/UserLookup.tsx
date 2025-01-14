import Lookup from "../../Core/Lookup";

class UserLookupComponent extends Lookup {
   
    getName(): string {
        return "UserLookup";
    }

    getType(): string {
        return "api";
    }

    getApiUrl(): string {
        return "https://localhost:7293/api/users";
    }

     
}

export default UserLookupComponent;
