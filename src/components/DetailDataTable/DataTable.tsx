/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Tooltip } from "@mui/material";
import { HeadersTableHead } from "./HeadersTableHead";
import Paper from '@mui/material/Paper';
import React, { useMemo } from "react";
import { Order, getComparator, stableSort } from "./SortingFunctions";
import { Data } from "./Data";
import useDataNormalize from "../../hooks/useDataNormalize";


interface DataTableProps {
    headers: string[];
    selectedKeys: string[];
    inputData: any[];
    hasFirsColLink?: boolean; // Indica si la primera columna debe ser un enlace
    detailParamId?: string; // parametro para detalle del indicador
}

export default function DataTable({ headers, selectedKeys, inputData, hasFirsColLink, detailParamId }: DataTableProps) {
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>('calories');
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const rows = useDataNormalize(headers, selectedKeys, inputData)

    const dynamicHeadCells = useMemo(() => {
        return headers.map(attr => ({
            id: attr,
            label: attr.toUpperCase().replace(/_/g, ' '),
            disablePadding: false,
            numeric: typeof rows[0][attr] === 'number',
        }));
    }, [headers, rows]);

    if (headers.length !== selectedKeys.length) {
        throw new Error("The number of headers and keys selected must match.");
    }

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {

        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(String(property));
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {

        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            stableSort(rows, getComparator(order, orderBy)).slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage,
            ),
        [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>

                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size="medium"
                    >

                        <HeadersTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={dynamicHeadCells}
                        />

                        <TableBody>
                            {visibleRows.map((row, index) => {

                                const isItemSelected = isSelected(Number(row.id));

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, Number(row.id))}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {Object.keys(row).map((key, columnIndex) => (
                                            <TableCell
                                                key={key}
                                                align={typeof row[key] === 'number' ? 'right' : 'left'}
                                                style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                {hasFirsColLink && columnIndex === 0 ? (
                                                    <a href={`${detailParamId}/${row[key]}`}>{row[key]}</a>
                                                ) : (
                                                    <Tooltip title={row[key]} enterDelay={300} leaveDelay={200}>
                                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {row[key]}
                                                        </div>
                                                    </Tooltip>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}

                            {emptyRows > 0 && (
                                <TableRow
                                    style={{
                                        height: 53 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

/*
<TableRow
                                        hover
                                        onClick={(event) => handleClick(event, Number(row.id))}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {Object.keys(row).map((key, columnIndex) => (
                                            <TableCell
                                                key={key}
                                                align={typeof row[key] === 'number' ? 'right' : 'left'}
                                                style={{ maxWidth: 250, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                {hasFirsColLink && columnIndex === 0 ? (
                                                    <a href={`${detailParamId}/${row[key]}`}>{row[key]}</a>
                                                ) : (
                                                    row[key]
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
*/

/*
return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, Number(row.id))}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {Object.keys(row).map((key, columnIndex) => (
                                            <TableCell key={key} align={typeof row[key] === 'number' ? 'right' : 'left'}>
                                                {hasFirsColLink && columnIndex === 0 ? (
                                                    <a href={`${detailParamId}/${row[key]}`}>{row[key]}</a>
                                                ) : (
                                                    row[key]
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
*/


/*
<TableRow
                                        hover
                                        onClick={(event) => handleClick(event, Number(row.id))}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >

                                        {Object.keys(row).map(key => (
                                            <TableCell key={key} align={typeof row[key] === 'number' ? 'right' : 'left'}>
                                                {row[key]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );

*/