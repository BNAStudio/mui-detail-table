import React from 'react';
import { Data } from './Data';
import { Order } from './SortingFunctions';
import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

interface HeaderTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: HeadCell[];
}

export function HeadersTableHead(props: HeaderTableProps) {

    const { order, orderBy, onRequestSort, headCells } = props;
    const createSortHandler =
        (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, String(property));
        };

    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}
