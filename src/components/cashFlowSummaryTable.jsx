import React from "react";
import { useTable } from "react-table";

function CashFlowSummaryTable({ breakdownData }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "Item",
        accessor: "item",
      },
      {
        Header: "Monthly ($)",
        accessor: "monthly",
      },
      {
        Header: "Yearly ($)",
        accessor: "yearly",
      },
    ],
    []
  );

  const breakdownTableProps = useTable({
    columns,
    data: breakdownData,
  });

  return (
    <div>
      <div className="output-container">
        <h2>Cash Flow Summary</h2>
        <table
          {...breakdownTableProps.getTableProps()}
          className="output-table"
        >
          <thead>
            {breakdownTableProps.headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...columnProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...breakdownTableProps.getTableBodyProps()}>
            {breakdownTableProps.rows.map((row) => {
              breakdownTableProps.prepareRow(row);
              return (
                <tr key={row} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashFlowSummaryTable;
