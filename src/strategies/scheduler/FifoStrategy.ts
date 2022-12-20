import { Process } from '../../types/process';
import { calculateTurnAround, isAllJobsFinalized } from '../../utils/JobsUtils';
import { colorSchedulerTableJobCeil, colorSchedulerTableTimerCeil, insertTimerColumn, printNameStrategy, printTurnAround, initialColumnsAmountByScreenSize } from '../../utils/DomUtils';
import { CLOCK_SPEED } from '../../configs/config';

export class FifoStrategy {
  public init(jobs: Process[]): void {
    const queue: Process[] = [];
    const initialColumns = initialColumnsAmountByScreenSize();

    for(let i = 0; i < initialColumns; i++) {
      insertTimerColumn(i);
    }

    printNameStrategy('First In First Out - Execution');

    setTimeout(() => {
      this.run(jobs, queue, 0, initialColumns);
    }, CLOCK_SPEED);
  }

  public run(jobs: Process[], queue: Process[], timer: number, initialColumns: number): void {
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
      this.strategy(jobs, queue, currentTime);
    }

    setTimeout(() => {
      currentTime++;
      this.run(jobs, queue, currentTime, initialColumns);
    }, CLOCK_SPEED);
  }

  public strategy(jobs: Process[], queue: Process[], timer: number) {
    const currentJob = queue[0];
    const originalJob = jobs.find(job => job.id === currentJob.id);

    if(originalJob !== undefined && (originalJob.executionTime > currentJob.executedTimes)) {
      colorSchedulerTableJobCeil(currentJob.id, timer, '#5ccf51');
      for(let i = 1; i < queue.length; i++) {
        colorSchedulerTableJobCeil(queue[i].id, timer, '#c1c9d0');
      }
      queue[0].executedTimes++;
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
    }
  }

  public checkAndUpdateQueue(jobs: Process[], queue: Process[], timer: number): void {
    for(let i = 0; i < jobs.length; i++) {
      if(timer === jobs[i].entryTime) {
        queue.push(jobs[i]);
      }
    }
  }

}
