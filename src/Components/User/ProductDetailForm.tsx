import Form from "../../Core/Form";

class ProductDetailForm extends Form {
    constructor(props: any) {
        super(props); 
    }

    getModel() {
        const formModel = {

            fields: [
                { name: "productName", label: "Product Name", size: 'col-6', visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
                { name: "quantity", label: "Quantity", size: 'col-6', type: "number", visible: true, isRequired: true, insertable: true, updateable: true, readonly: false },
            ],
        };

        return formModel;
    }
}

export default ProductDetailForm;