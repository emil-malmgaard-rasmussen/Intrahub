import {
    TableCell,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@mui/material';
import { Answer } from '../../../../firebase/models/ApvAnswerModel';

type ParticipantAnswerTableHeadProps = {
    onSort: (id: string) => void;
    headLabel: Record<string, any>[];
};

export const ParticipantAnswerTableHead = ({
                                               onSort,
                                               headLabel,
                                           }: ParticipantAnswerTableHeadProps) => {
    return (
        <TableHead>
            <TableRow>
                {headLabel.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.align || 'left'}
                        sx={{ width: headCell.width, minWidth: headCell.minWidth }}
                    >
                        <TableSortLabel
                            direction="asc"
                            onClick={() => onSort(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

type ParticipantAnswerTableRowProps = {
    row: Answer;
};

export const ParticipantAnswerTableRow = ({
                                              row,
                                          }: ParticipantAnswerTableRowProps) => {
    return (
        <TableRow hover tabIndex={0} role="row">
            <TableCell>{row.title}</TableCell>
            <TableCell>{row.description}</TableCell>
            <TableCell>{row.answer ? 'Ja' : 'Nej'}</TableCell>
            <TableCell>{row.comment}</TableCell>
        </TableRow>
    );
};
