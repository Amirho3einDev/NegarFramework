export default interface FormModel {
    fields: Field[]
}

interface Field {
    name: string;
    label: string;
    size: string, visible: boolean;
    isRequired: boolean;
    insertable: boolean;
    updateable: boolean; readonly: boolean;
    type:string;
    isDetail: boolean | null;
    detailModel: FormModel | null;

}  