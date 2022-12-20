import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SettingsIcon, RepeatIcon, AddIcon } from '@chakra-ui/icons';
import { Button,  useDisclosure, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Tooltip, useToast, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Divider, Select, DrawerFooter, Text, Checkbox } from '@chakra-ui/react';
import { StoppedSchedulerPanel } from '../../components/StoppedSchedulerPanel/StoppedSchedulerPanel';
import { CreateJobFormValues, CreateJobModal } from '../../components/CreateJobModal/CreateJobModal';
import { ListJobsTable } from '../../components/ListJobsTable/ListJobsTable';
import { isAllJobsFinalized, jobStrategyFactory, mockSomeJobs } from '../../utils/JobsUtils';
import { Process } from '../../types/process';
import './scheduler.css';
import { CLOCK_SPEED } from '../../configs/config';

export function SchedulerPage(){
  let scheduler = null;
  const [freeReloadButton, setFreeReloadButton] = useState<boolean>(true);
  const [schedulerIsRunning, setSchedulerIsRunning] = useState<boolean>(false);
  const [schedulerAlgorithm, setSchedulerAlgorithm] = useState<string>('fifo');
  const [paginationAlgorithm, setPaginationAlgorithm] = useState<string>('fifo');
  const [quantum, setQuantum] = useState<number>(1);
  const [overload, setOverload] = useState<number>(1);
  const [jobs, setJobs] = useState<Process[]>([]);
  const [useMockedJobs, setUseMockedJobs] = useState<boolean>(false);

  const toast = useToast();

  const { 
    isOpen: isOpenCreateJobModal, 
    onOpen: onOpenCreateJobModal, 
    onClose: onCloseCreateJobModal
  } = useDisclosure();

  const { 
    isOpen: isOpenDrawerSchedulerSettings, 
    onOpen: onOpenDrawerSchedulerSettings, 
    onClose: onCloseDrawerSchedulerSettings 
  } = useDisclosure();

  const handleAddNewJob = async (data: CreateJobFormValues) => {
    setJobs([
      ...jobs,
      {
        id: jobs.length == 0 ? 0 : jobs.slice(-1)[0].id + 1,
        entryTime: Number(data.entryTime),
        priority: Number(data.priority),
        deadline: Number(data.deadline),
        pagesAmount: Number(data.pagesAmount),
        executionTime: Number(data.executionTime),
        alreadyExecuted: false,
        finalizedTime: 0,
        executedTimes: 0,
      }
    ]);

    onCloseCreateJobModal();

    toast({
      description: 'Job has been added with success!',
      status: 'success',
      position: 'bottom',
      duration: 3000,
      isClosable: true
    });
  };

  const handleClearSettings = () => {
    setJobs([]);
    setQuantum(1);
    setOverload(1);
    setSchedulerAlgorithm('fifo');
    setPaginationAlgorithm('fifo');
    setSchedulerIsRunning(false);
  };

  const handleRemoveJob = (jobId: number) => {
    setJobs(jobs.filter((p) => p.id !== jobId));
  };

  const handleAbortSimulation = () => {
    document.location.reload();
  };

  const handleStartScheduler = () => {
    setSchedulerIsRunning(true);
    onCloseDrawerSchedulerSettings();
    toast.closeAll();

    scheduler = jobStrategyFactory(schedulerAlgorithm);
    scheduler.init(jobs, quantum, overload);
  };

  const handleUseMockedJobs = (event: any) => {
    setUseMockedJobs(event.target.checked);
    
    if(event.target.checked) {
      setJobs(mockSomeJobs(5, 3));
    }
    else {
      setJobs([]);
    }
  };

  useEffect(() => {
    setInterval(() => {
      if(schedulerIsRunning && isAllJobsFinalized(jobs)) {
        setFreeReloadButton(false);
      }
    }, CLOCK_SPEED*2);
  });

  return(
    <div className='scheduler-container'>
      <nav>
        <Button bgColor={'#E19F41'} onClick={onOpenDrawerSchedulerSettings} disabled={schedulerIsRunning}>
          <SettingsIcon w={6} h={6} className={!schedulerIsRunning ? 'icon-rotation' : ''} />
        </Button>
        <Link to="/">
          <h1>Process Scheduling</h1>
        </Link>
        <span></span>
      </nav>
      <CreateJobModal open={isOpenCreateJobModal} onClose={onCloseCreateJobModal} onSubmit={handleAddNewJob}></CreateJobModal>
      <Drawer size={'md'} isOpen={isOpenDrawerSchedulerSettings} placement={'left'} onClose={onCloseDrawerSchedulerSettings}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Scheduler Settings</DrawerHeader>

          <DrawerBody>
            <div className='input-box'>
              <Text mb={1}>Quantum</Text>
              <NumberInput value={quantum} min={1} onChange={(e) => { setQuantum(parseInt(e)); }}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div className='input-box'>
              <Text mb={1}>Overload</Text>
              <NumberInput value={overload} min={1} onChange={(e) => { setOverload(parseInt(e)); }}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </div>
            <div className='input-box'>
              <Text mb={1}>Scheduler Strategy</Text>
              <Select value={schedulerAlgorithm} onChange={(e) => { setSchedulerAlgorithm(e.target.value); }}>
                <option value='fifo'>First In First Out</option>
                <option value='sjf'>Shortest Job First</option>
                <option value='edf'>Earliest Deadline First</option>
                <option value='rr'>Round Robin</option>
              </Select>
            </div>
            <div className='input-box'>
              <Text mb={1}>Pagination Strategy</Text>
              <Select disabled={true} value={paginationAlgorithm} onChange={(e) => { setPaginationAlgorithm(e.target.value); }}>
                <option value='fifo'>First In First Out</option>
                <option value='lru'>Least Recently Used</option>
              </Select>
            </div>
            <Divider mt={4} mb={4}/>
            <Button mb={4} leftIcon={<AddIcon />} bgColor={'#E19F41'} variant={'solid'} width={'100%'} onClick={onOpenCreateJobModal}>Add New Job</Button>
            <ListJobsTable jobs={jobs} removeJob={handleRemoveJob}></ListJobsTable>
            <Checkbox defaultChecked={useMockedJobs} onChange={(e) => handleUseMockedJobs(e)}>Use mocked jobs</Checkbox>
          </DrawerBody>

          <DrawerFooter>
            <Button colorScheme={'red'} variant={'outline'} mr={3} onClick={handleClearSettings}>Clear</Button>
            <Tooltip label={'You have to add jobs before get started.'} isDisabled={jobs.length >0}>
              <Button colorScheme={'green'} variant={'solid'} disabled={jobs.length <= 0 || schedulerIsRunning} onClick={handleStartScheduler}>Start</Button>
            </Tooltip>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className={(schedulerIsRunning || isAllJobsFinalized(jobs)) ? 'scheduler-content-tables' : 'display-none'}>
        <div className='scheduler-content-title'>
          <h2 id='scheduler-content-title-name'>Execution</h2>
          <h3 id='scheduler-content-title-infos'></h3>
        </div>
        <TableContainer width={'100%'}>
          <Table size={'sm'} id={'scheduler-table'} variant={'striped'} colorScheme={'blackAlpha'}>
            <Thead id='scheduler-table-head'>
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
              </Tr>
            </Thead>
            <Tbody id='scheduler-table-body'>
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
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
        <div className='scheduler-content-footer'>
          <span id='text-turn-around'></span>
          <Button 
            isLoading={freeReloadButton}
            colorScheme='blue'
            size={'sm'}
            width={'xs'}
            variant='solid'
            onClick={handleAbortSimulation}>Reload</Button>
        </div>
      </div>
      <div className={(!schedulerIsRunning && !isAllJobsFinalized(jobs)) ? 'scheduler-content-centralized' : 'display-none'}>
        <StoppedSchedulerPanel></StoppedSchedulerPanel>
      </div>
    </div>
  );
}
