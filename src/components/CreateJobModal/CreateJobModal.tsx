import React from 'react';
import { useForm } from 'react-hook-form';
import { FormLabel, FormControl, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';

export interface CreateJobFormValues {
  entryTime: number;
  executionTime: number;
  deadline: number;
  priority: number;
  pagesAmount: number;
}

export interface CreateJobModalFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateJobFormValues) => Promise<void>
}
  
export const CreateJobModal: React.FC<CreateJobModalFormProps> = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, formState } = useForm<CreateJobFormValues>({ mode: 'onSubmit' });
  const { isSubmitting } = formState;
  
  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Adding new job</ModalHeader>
        <ModalCloseButton />
  
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl mb={6}>
              <FormLabel htmlFor='entryTime'>Entry Time</FormLabel>
              <NumberInput defaultValue={0} min={0} width={'100%'}>
                <NumberInputField {...register('entryTime')}/>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mb={6}>
              <FormLabel htmlFor='executionTime'>Execution Time</FormLabel>
              <NumberInput defaultValue={1} min={1} width={'100%'}>
                <NumberInputField {...register('executionTime')}/>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mb={6}>
              <FormLabel htmlFor='priority'>Priority Level</FormLabel>
              <NumberInput defaultValue={1} min={1} width={'100%'}>
                <NumberInputField {...register('priority')}/>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mb={6}>
              <FormLabel htmlFor='deadline'>Deadline Time</FormLabel>
              <NumberInput defaultValue={1} min={1} width={'100%'}>
                <NumberInputField {...register('deadline')}/>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl mb={6}>
              <FormLabel htmlFor='pagesAmount'>Pages Amount</FormLabel>
              <NumberInput defaultValue={1} min={1} max={10} width={'100%'}>
                <NumberInputField {...register('pagesAmount')}/>
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <Button mt={5} mr={3} colorScheme='red' variant='outline' disabled={isSubmitting} isLoading={isSubmitting} onClick={onClose}>Cancel</Button>
            <Button mt={5} colorScheme='green' variant='solid' isLoading={isSubmitting} type='submit'>Submit</Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
