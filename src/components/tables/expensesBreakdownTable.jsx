import React from "react";
import { useTable } from 'react-table';

function ExpensesBreakdownTable({ data }) {

    const columns = React.useMemo(
        () => [
          {
            Header: 'Item',
            accessor: 'item',
          },
          {
            Header: 'Monthly ($)',
            accessor: 'monthly',
          },
          {
            Header: 'Yearly ($)',
            accessor: 'yearly',
          },
        ],
        []
      );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
      });
    
    return (
        <div className="output-container">
        <h2>Expenses Breakdown</h2>
        <table {...getTableProps()} className="output-table">
        <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...columnProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr key={row} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>

        
      </div>
    );
}

export default ExpensesBreakdownTable;