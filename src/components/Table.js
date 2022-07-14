import React, { Component } from "react";
import { Column, Table, AutoSizer, SortDirection } from "react-virtualized";
import 'react-virtualized/styles.css'
import _ from "lodash";
import Paginator from "./Paginator";
import * as XLSX from "xlsx";
import axios from "axios";
import { FaSistrix } from "react-icons/fa";
import "./Table.css";

const VirtualizedTable = ({ rows, ...props }) => (
  
  <AutoSizer disableHeight>
    {({ width }) => (
      <Table
        width={width}
        {...props}
      />
    )}
  </AutoSizer>
)

window.mota = [];
const EXTENSIONS = ["xlsx", "xls", "csv"];
class TrialTable extends Component {
  constructor() {
    super();
    const sortBy = "name";
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({ sortBy, sortDirection });
    this.state = {
      data: [],
      tittleTable: [],
      page: 1,
      perPage: 18,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      search: "",
    };
    this.handleRowsScroll = this.handleRowsScroll.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  async ApiData(value) {
    const deta = await axios.get(
      ` https://jsonplaceholder.typicode.com/comments?_sort=${value}&_order=asc`
    );

    this.setState({ data: deta.data });
    const headers = deta.data;
    const head1 = headers[0] && Object.keys(headers[0]);
    this.setState({ tittleTable: head1 });
    window.mota = deta.data;
  }
  componentDidMount() {
    this.ApiData();
  }
  getExention = (file) => {
    const parts = file.name.split(".");
    const extension = parts[parts.length - 1];
    return EXTENSIONS.includes(extension);
  };
  convertToJson = (headers, data) => {
    const deta = [];
    data.forEach((row) => {
      let rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      deta.push(rowData);
    });
    return deta;
  };
  importExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      this.setState({ tittleTable: headers });
      const heads = headers.map((head) => ({ title: head, field: head }));
      fileData.splice(0, 1);
      this.setState({ data: this.convertToJson(headers, fileData) });
      window.mota = this.convertToJson(headers, fileData);
    };
    if (file) {
      if (this.getExention(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel, CSV file");
      }
    } else {
      this.setState({ data: [] });
      this.setState({ colDefs: [] });
    }
  };
  handleRowsScroll({ stopIndex }) {
    this.setState((prevState) => {
      const page = Math.ceil(stopIndex / prevState.perPage);
      return { page, scrollToIndex: undefined };
    });
  }
  handlePageChange(page) {
    this.setState((prevState) => {
      const scrollToIndex = (page - 1) * prevState.perPage;
      return { page, scrollToIndex };
    });
  }
  searchRows(rows) {
    const columns = rows[0] && Object.keys(rows[0]);
    return rows.filter((row) =>
      columns.some(
        (column) =>
          row[column]
            .toString()
            .toLowerCase()
            .indexOf(this.state.search.trim().toLowerCase()) > -1
      )
    );
  }
  render() {
    const { page, perPage, scrollToIndex } = this.state;
    const headerHeight = 30;
    const rowHeight = 40;
    const height = rowHeight * perPage + headerHeight;
    const rowCount = window.mota.length;
    const pageCount = Math.ceil(rowCount / perPage);

    return (
      <div>
        <h2 align="center">Select Excel File to See Table</h2>
        <input type="file" onChange={this.importExcel} />
        <h1>React virtualized table5 </h1>
        {this.state.search ? (
          <div className="Wrapper_outer">
            <table className="searchContainer">
              <tbody>
                <tr className="elementContainer">
                  <td className="search">
                    <input
                      type="text"
                      placeholder="Search ......"
                      className="search"
                      value={this.state.search}
                      onChange={(e) =>
                        this.setState({ search: e.target.value })
                      }
                    />
                  </td>
                  <td className="fontAwesome_icon">
                    <FaSistrix className="fontAwesome_icon" />
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
            <Paginator
              pageCount={pageCount}
              currentPage={page}
              onPageChange={this.handlePageChange}
            />
            <VirtualizedTable
              rowHeight={rowHeight}
              headerHeight={headerHeight}
              height={height}
              rows={window.mota}
              sort={this._sort}
              sortBy={this.state.sortBy}
              sortDirection={this.state.sortDirection}
              rowCount={this.searchRows(window.mota).length}
              rowGetter={({ index }) => this.searchRows(window.mota)[index]}
              onRowsRendered={this.handleRowsScroll}
              scrollToIndex={scrollToIndex}
              scrollToAlignment="start"
            >
              {this.state.tittleTable.map((i, k) => (
                <Column key={k} label={i} dataKey={i} width={200} />
              ))}
            </VirtualizedTable>
          </div>
        ) : (
          <div className="Wrapper_outer">
            <table className="searchContainer">
              <tbody>
                <tr className="elementContainer">
                  <td className="search">
                    <input
                      type="text"
                      placeholder="Search ......"
                      className="search"
                      value={this.state.search}
                      onChange={(e) =>
                        this.setState({ search: e.target.value })
                      }
                    />
                  </td>
                  <td className="fontAwesome_icon">
                    <FaSistrix className="fontAwesome_icon" />
                  </td>
                </tr>
              </tbody>
            </table>
            <hr />
            <Paginator
              pageCount={pageCount}
              currentPage={page}
              onPageChange={this.handlePageChange}
            />

            <VirtualizedTable
              rowHeight={rowHeight}
              headerHeight={headerHeight}
              height={height}
              rows={window.mota}
              sort={this._sort}
              sortBy={this.state.sortBy}
              sortDirection={this.state.sortDirection}
              rowCount={this.state.sortedList.length}
              rowGetter={({ index }) => this.state.sortedList[index]}
              onRowsRendered={this.handleRowsScroll}
              scrollToIndex={scrollToIndex}
              scrollToAlignment="start"
            >
              {this.state.tittleTable.map((i, k) => (
                <Column key={k} label={i} dataKey={i} width={200} />
              ))}
            </VirtualizedTable>
          </div>
        )}
      </div>
    );
  }
  _sortList = ({ sortBy, sortDirection }) => {
    let newList = _.sortBy(window.mota, [sortBy]);
    if (sortDirection === SortDirection.DESC) {
      newList.reverse();
    }
    return newList;
  };
  _sort = ({ sortBy, sortDirection }) => {
    const sortedList = this._sortList({ sortBy, sortDirection });
    this.setState({ sortBy, sortDirection, sortedList });
  };
}

export default TrialTable;
