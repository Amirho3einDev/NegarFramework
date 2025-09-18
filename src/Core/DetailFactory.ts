import ProductDetail from "../Components/User/ProductDetail";

class DetailFactory {
    static DetailComponents: { [key: string]: any } = {
        details: ProductDetail
    };

    static getDetailComponent(name: string):any | null {
        return DetailFactory.DetailComponents[name] || null;
    }
}

export default DetailFactory;