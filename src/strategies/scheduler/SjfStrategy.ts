import { Process } from '../../types/process';
import { calculateTurnAround, isAllJobsFinalized } from '../../utils/JobsUtils';
import { colorSchedulerTableJobCeil, colorSchedulerTableTimerCeil, initialColumnsAmountByScreenSize, insertTimerColumn, printNameStrategy, printTurnAround } from '../../utils/DomUtils';
import { CLOCK_SPEED } from '../../configs/config';

export class SjfStrategy {
  public init(jobs: Process[]): void {
    const queue: Process[] = [];

    const initialColumns = initialColumnsAmountByScreenSize();

    for(let i = 0; i < initialColumns; i++) {
      insertTimerColumn(i);
    }

    printNameStrategy('Shortest Job First - Execution');

    setTimeout(() => {
      this.run(jobs, queue, null, 0, initialColumns);
    }, CLOCK_SPEED);
  }

  public run(jobs: Process[], queue: Process[], currentJob: Process | null, timer: number, initialColumns: number) : void {
    let currentTime = timer;
    
    if(isAllJobsFinalized(jobs)) {
      printTurnAround(calculateTurnAround(jobs));
      return;
    }

    if(currentTime >= initialColumns) {
      insertTimerColumn(currentTime);
    }
    colorSchedulerTableTimerCeil(currentTime);

    this.checkAndUpdateQueue(jobs, queue, currentTime);

    if(queue.length > 0) {
      currentJob = queue[0];
      const { updatedJobs, updatedQueue, updatedCurrentJob, updatedTimer } = this.strategy(jobs, queue, currentJob, currentTime);
      jobs = updatedJobs;
      queue = updatedQueue;
      currentJob = updatedCurrentJob;
      currentTime = updatedTimer;
    }

    setTimeout(() => {
      currentTime++;
      this.run(jobs, queue, currentJob, currentTime, initialColumns);
    }, CLOCK_SPEED);
  }

  public strategy(jobs: Process[], queue: Process[], currentJob: Process, timer: number) {
    const originalJob = jobs.find(job => job.id === currentJob.id);

    if(originalJob !== undefined && (originalJob.executionTime > currentJob.executedTimes)) {
      colorSchedulerTableJobCeil(currentJob.id, timer, '#5ccf51');
      for(let i = 1; i < queue.length; i++) {
        colorSchedulerTableJobCeil(queue[i].id, timer, '#c1c9d0');
      }

      currentJob.executedTimes++;
    }
    if(currentJob.executedTimes === originalJob?.executionTime) {
      jobs.find(job => {
        if(job.id === currentJob?.id) {
          job.finalizedTime = timer;
          job.executedTimes = currentJob.executedTimes;
          job.alreadyExecuted = true;
        }
      });

      queue.shift();
      if(queue.length > 0) {
        queue.sort((jobA, jobB) => jobA.executionTime - jobB.executionTime);
        currentJob = queue[0];
      }
    }

    return { 
      updatedJobs: jobs, 
      updatedQueue: queue, 
      updatedCurrentJob: currentJob,
      updatedTimer: timer,
    };
  }

  public checkAndUpdateQueue(jobs: Process[], queue: Process[], timer: number): void {
    let countJobsWithSameTimeEntry = 0;
    
    for(let i = 0; i < jobs.length; i++) {
      if(timer === jobs[i].entryTime) {
        queue.push(jobs[i]);
        countJobsWithSameTimeEntry++;
      }
    }

    if((queue.length - countJobsWithSameTimeEntry === 0) && countJobsWithSameTimeEntry > 1) {
      queue.sort((jobA, jobB) => jobA.executionTime - jobB.executionTime);
    }
  }

}
