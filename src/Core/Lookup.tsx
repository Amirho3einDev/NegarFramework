import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";

interface LookupProps {
    value: any;
    onChange: (value: any) => void;
    lookupName: string;
    lookupType: "api" | "enum";
}

interface LookupState {
    visible: boolean;
    data: any[];
    totalRecords: number;
    search: string;
    loading: boolean;
    selectedItem: any;
    first: number;
}

class Lookup extends Component<LookupProps, LookupState> {
    enums: { [key: string]: any[] } = {
        StatusEnum: [
            { id: 1, name: "Active" },
            { id: 2, name: "Inactive" },
            { id: 3, name: "Pending" },
        ],
    };

    constructor(props: LookupProps) {
        super(props);
        this.state = {
            visible: false,
            data: [],
            totalRecords: 0,
            search: "",
            loading: false,
            selectedItem: null,
            first: 0,
        };
    }

    componentDidMount() {
        if (this.props.lookupType === "enum") {
          const enumData = this.enums[this.props.lookupName] || [];
          this.setState({ data: enumData, totalRecords: enumData.length });
        } else {
          this.fetchData();
        }
      }

    fetchData = async (first = 0) => {
        if (this.props.lookupType === "enum") {
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.get(`/api/${this.props.lookupName}`, {
                params: { skip: first, take: 10, search: this.state.search },
            });

            this.setState((prevState) => ({
                data: first === 0 ? response.data.items : [...prevState.data, ...response.data.items],
                totalRecords: response.data.total,
                loading: false,
            }));
        } catch (error) {
            console.error("Error fetching lookup data", error);
            this.setState({ loading: false });
        }
    };

    loadEnumData = () => {
        const enumData = this.enums[this.props.lookupName] || [];
        this.setState({ data: enumData, totalRecords: enumData.length });
    };

    onLazyLoad = (event: any) => {
        if (this.state.loading) return;

        const nextFirst = event.first;
        this.setState({ first: nextFirst }, () => this.fetchData(nextFirst));
    };

    onVirtualScroll = async (event: any) => {
        if (this.state.loading) return;
      
        const nextFirst = event.first;
        this.setState({ first: nextFirst, loading: true });
      
        if (this.props.lookupType === "enum") {
          return;
        }
      
        try {
          const response = await axios.get(`/api/${this.props.lookupName}`, {
            params: { skip: nextFirst, take: 10, search: this.state.search },
          });
      
          this.setState((prevState) => ({
            data: [...prevState.data, ...response.data.items],
            totalRecords: response.data.total,
            loading: false,
          }));
        } catch (error) {
          console.error("Error fetching lookup data", error);
          this.setState({ loading: false });
        }
      };

    handleSelect = () => {
        if (this.state.selectedItem) {
            this.props.onChange(this.state.selectedItem);
            this.setState({ visible: false });
        }
    };

    render() {
        return (
            <div>
                <div className="p-inputgroup">
                    <InputText value={this.props.value?.name || ""} readOnly />
                    <Button icon="pi pi-search" onClick={() => this.setState({ visible: true }, () => this.fetchData())} />
                </div>

                <Dialog header="Select Item" visible={this.state.visible} onHide={() => this.setState({ visible: false })}>
                    <InputText
                        value={this.state.search}
                        onChange={(e) => this.setState({ search: e.target.value, first: 0 }, () => this.fetchData(0))}
                        placeholder="Search..."
                    />

                    <DataTable
                        value={this.state.data}
                        scrollable
                        scrollHeight="400px"
                        loading={this.state.loading}
                        selectionMode="single"
                        selection={this.state.selectedItem}
                        onSelectionChange={(e) => this.setState({ selectedItem: e.value })}
                        virtualScrollerOptions={{
                            lazy: true,
                            itemSize: 40,
                            onScroll: (event) => this.onVirtualScroll(event),
                        }}
                    >
                        <Column field="id" header="ID" />
                        <Column field="name" header="Name" />
                    </DataTable>

                    <Button label="Select" onClick={this.handleSelect} />
                </Dialog>
            </div>
        );
    }
}

export default Lookup;
