import UserLookupComponent from "../Components/User/UserLookup";
import Lookup from "./Lookup";

class LookupFactory {
    static lookupComponents: { [key: string]: typeof Lookup } = {
        UserLookup:UserLookupComponent
    };

    static getLookupComponent(name: string): typeof Lookup | null {
        return LookupFactory.lookupComponents[name] || null;
    }
}

export default LookupFactory;