import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import '../styles/table.css';

const TableOfShame = () => {
  return (
    <Table className="table-item">
      <TableHead>
        <TableRow>
          <TableCell>No</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Position</TableCell>
          <TableCell>Institution</TableCell>
          <TableCell className="importantItem">Unfinished Tasks</TableCell>
          <TableCell className="importantItem">Overdue deadlines</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow className="row-item">
          <TableCell>1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>Student</TableCell>
          <TableCell>University of Lagos</TableCell>
          <TableCell>3</TableCell>
          <TableCell>2</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default TableOfShame;
