import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";  
import ProductDetailForm from "./ProductDetailForm";
import DetailGrid from "../../Core/DetailGrid";
 

class ProductDetail extends DetailGrid {
  constructor(props: any) {
    super(props);
  }
   

  getFormComponent(): JSX.Element | null {
    return  <ProductDetailForm  
    loadFromApi={false}
    selectedEntity={null}
    onSubmit={ (newData: any) => {
            
            this.handleAdd(newData)
          }
        } 
    />;
  }
 
}

export default ProductDetail;
