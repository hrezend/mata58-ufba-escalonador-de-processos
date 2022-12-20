import React from 'react';
import { WarningTwoIcon } from '@chakra-ui/icons';
import './stoppedSchedulerPanel.css';

export const StoppedSchedulerPanel = () => {
  return (
    <div className={'stopped-scheduler-container'}>
      <WarningTwoIcon w={40} h={40} color='#C4C4C4'></WarningTwoIcon>
      <h1>Click the gear in the upper left corner to configure the scheduler.</h1>
      <h2>After configuring press start button to start scaling!</h2>
      <span>In the meantime, <a href='https://linkedin.com/in/hrezend' target='_blank' rel='noreferrer'>how about meeting me?</a></span>
    </div>
  );
};
