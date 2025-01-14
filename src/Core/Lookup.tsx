import React, { Component, createRef } from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { AutoComplete } from "primereact/autocomplete";

type LookupProps = {
    value: any;
    onChange: (value: any) => void;
    // lookupName: string;
    // lookupType: "api" | "enum";
}


interface LookupState {
    visible: boolean;
    data: any[];
    totalRecords: number;
    search: string;
    loading: boolean;
    selectedItem: any;
    first: number;
    name: string;
    type: string; // "api" | "enum";
}

class Lookup extends Component<LookupProps, LookupState> {
    enums: { [key: string]: any[] } = {
        StatusEnum: [
            { id: 1, name: "Active" },
            { id: 2, name: "Inactive" },
            { id: 3, name: "Pending" },
        ],
    };

    autoCompleteRef: React.RefObject<AutoComplete>;

    getName(): string {
        return "";
    }

    getType(): string {
        return "";
    }

    getApiUrl(): string {
        return "";
    }



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
            name: this.getName(),
            type: this.getType()
        };

        this.autoCompleteRef = createRef();
    }



    componentDidMount() {
        if (this.state.type === "enum") {
            const enumData = this.enums[this.state.name] || [];
            this.setState({ data: enumData, totalRecords: enumData.length });
        } else {
            this.fetchData();
        }
    }

    fetchData = async (first = 0) => {
        if (this.state.type === "enum") {
            return;
        }

        this.setState({ loading: true });

        try {
            const response = await axios.post(this.getApiUrl(), {
                params: { skip: first, take: 10, search: this.state.search },
            });

            this.setState((prevState) => ({
                data: first === 0 ? response.data.records : [...prevState.data, ...response.data.records],
                totalRecords: response.data.total,
                loading: false,
            }));

            console.log(this.state.data);
        } catch (error) {
            console.error("Error fetching lookup data", error);
            this.setState({ loading: false });
        }
    };

    loadEnumData = () => {
        const enumData = this.enums[this.state.name] || [];
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

        if (this.state.type === "enum") {
            return;
        }

        try {
            const response = await axios.post(`${this.getApiUrl()}`, {
                params: { skip: nextFirst, take: 10, search: this.state.search },
            });

            this.setState((prevState) => ({
                data: [...prevState.data, ...response.data.records],
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

    handleFocus = () => {
        if (this.state.data.length === 0) {
            this.fetchData();
        }

        if (this.autoCompleteRef.current) {
            this.autoCompleteRef.current.show();
        }
    };

    render() {
        return (
            <div>
                <AutoComplete
                ref={this.autoCompleteRef}
                    value={this.props.value}
                    suggestions={this.state.data}
                    completeMethod={(e) => { this.setState({ search: e.query, first: 0 }); this.fetchData(0); }}
                    field="name"  
                    onChange={(e) => this.props.onChange(e.value)}
                    onFocus={this.handleFocus}
                    placeholder="Select an option"
                    virtualScrollerOptions={{
                        lazy: true,
                        itemSize: 40,
                        onScroll: this.onLazyLoad,
                    }}
                />
            </div>
        );
    }
}

export default Lookup;
