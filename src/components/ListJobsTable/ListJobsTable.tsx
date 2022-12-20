import React, { TableHTMLAttributes } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Tooltip } from '@chakra-ui/react';
import { Process } from '../../types/process';

interface ListJobsTableProps extends TableHTMLAttributes<HTMLTableElement>{
  jobs: Process[];
  removeJob: (jobId: number) => void
}

export const ListJobsTable: React.FC<ListJobsTableProps> = ({ jobs, removeJob }) => {
  return (
    <TableContainer>
      <Table variant='simple'>
        <TableCaption>{jobs.length} Job(s) Found</TableCaption>
        <Thead className={jobs.length > 0 ? '' : 'display-none'}>
          <Tr>
            <Tooltip label='Job ID'>
              <Th>ID</Th>
            </Tooltip>
            <Tooltip label='Entry Time'>
              <Th>ET</Th>
            </Tooltip>
            <Tooltip label='Execution Time'>
              <Th>EX</Th>
            </Tooltip>
            <Tooltip label='Deadline'>
              <Th>DL</Th>
            </Tooltip>
            <Tooltip label='Priority'>
              <Th>PT</Th>
            </Tooltip>
            <Tooltip label='Pages Amount'>
              <Th>PA</Th>
            </Tooltip>
            <Tooltip label='Actions'>
              <Th></Th>
            </Tooltip>
          </Tr>
        </Thead>
        <Tbody>
          {jobs
            .sort((a, b) => a.id - b.id)
            .map((jobs, i) => (
              <Tr key={i}>
                <Td>{jobs.id}</Td>
                <Td>{jobs.entryTime}</Td>
                <Td>{jobs.executionTime}</Td>
                <Td>{jobs.deadline}</Td>
                <Td>{jobs.priority}</Td>
                <Td>{jobs.pagesAmount}</Td>
                <Tooltip label='Remove this job'>
                  <Td>
                    <button onClick={() => removeJob(jobs.id)}>
                      <DeleteIcon color="red"/>
                    </button>
                  </Td>
                </Tooltip>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
