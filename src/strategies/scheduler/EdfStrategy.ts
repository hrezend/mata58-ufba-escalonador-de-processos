import { Process } from '../../types/process';
import { calculateTurnAround, isAllJobsFinalized } from '../../utils/JobsUtils';
import { colorSchedulerTableJobCeil, colorSchedulerTableTimerCeil, initialColumnsAmountByScreenSize, insertTimerColumn, printInformationsStrategy, printNameStrategy, printTurnAround } from '../../utils/DomUtils';
import { CLOCK_SPEED } from '../../configs/config';

export class EdfStrategy {
  public init(jobs: Process[], quantum: number, overload: number): void {
    const queue: Process[] = [];

    const initialColumns = initialColumnsAmountByScreenSize();

    for(let i = 0; i < initialColumns; i++) {
      insertTimerColumn(i);
    }

    printNameStrategy('Earliest Deadline First - Execution');
    printInformationsStrategy(`Quantum: ${quantum} - Overload: ${overload}`);

    setTimeout(() => {
      this.run(jobs, queue, null, 0, quantum, 0, overload, 0, false, initialColumns);
    }, CLOCK_SPEED);
  }

  public run(jobs: Process[], queue: Process[], currentJob: Process | null, timer: number,  quantum: number, countQuantum: number, overload: number, countOverload: number, overloaded: boolean, initialColumns: number) : void {
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

    if(overloaded) {
      const { updatedCurrentJob, updatedOverload, stillOverloaded } = this.handleOverload(queue, currentJob, currentTime, overload, countOverload, overloaded);
      currentJob = updatedCurrentJob;
      overloaded = stillOverloaded;
      countOverload = updatedOverload;
    }
    else if(queue.length > 0) {
      currentJob = queue[0];
      
      const { updatedJobs, updatedQueue, updatedCurrentJob, updatedTimer, updatedCountQuantum, updatedOverloaded } = this.strategy(jobs, queue, currentJob, currentTime, quantum, countQuantum, overloaded);
      jobs = updatedJobs;
      queue = updatedQueue;
      currentJob = updatedCurrentJob;
      currentTime = updatedTimer;
      countQuantum = updatedCountQuantum;
      overloaded = updatedOverloaded;
    }

    setTimeout(() => {
      currentTime++;
      this.run(jobs, queue, currentJob, currentTime, quantum, countQuantum, overload, countOverload, overloaded, initialColumns);
    }, CLOCK_SPEED);
  }

  public strategy(jobs: Process[], queue: Process[], currentJob: Process, timer: number, quantum: number, countQuantum: number, overloaded: boolean) {
    const originalJob = jobs.find(job => job.id === currentJob.id);

    if(originalJob !== undefined && (originalJob.executionTime > currentJob.executedTimes)) {
      if((currentJob.entryTime + currentJob.deadline) < timer) {
        colorSchedulerTableJobCeil(currentJob.id, timer, '#3e8a36');
      }
      else {
        colorSchedulerTableJobCeil(currentJob.id, timer, '#5ccf51');
      }

      for(let i = 1; i < queue.length; i++) {
        colorSchedulerTableJobCeil(queue[i].id, timer, '#c1c9d0');
      }

      currentJob.executedTimes++;
      countQuantum++;
    }

    if((countQuantum === quantum) && (currentJob.executedTimes < originalJob!.executionTime)) {
      countQuantum = 0;
      overloaded = true;
    }
    else if(currentJob.executedTimes === originalJob?.executionTime) {
      jobs.find(job => {
        if(job.id === currentJob?.id) {
          job.finalizedTime = timer;
          job.executedTimes = currentJob.executedTimes;
          job.alreadyExecuted = true;
        }
      });
    
      queue.shift();
      if(queue.length > 0) {
        currentJob = queue[0];
      }

      countQuantum = 0;
      overloaded = false;
    }

    return { 
      updatedJobs: jobs, 
      updatedQueue: queue, 
      updatedCurrentJob: currentJob,
      updatedTimer: timer,
      updatedCountQuantum: countQuantum,
      updatedOverloaded: overloaded
    };
  }

  public handleOverload(queue: Process[], currentJob: Process | null, timer: number, overload: number, countOverload: number, overloaded: boolean) {    
    countOverload++;
    
    if(currentJob !== null) {
      colorSchedulerTableJobCeil(currentJob.id, timer, '#ed4a4a');
    }

    for(let i = 1; i < queue.length; i++) {
      colorSchedulerTableJobCeil(queue[i].id, timer, '#c1c9d0');
    }

    if(countOverload === overload) {
      overloaded = false;
      countOverload = 0;

      if(currentJob !== null) {
        queue.push(currentJob);
        queue.shift();
        queue.sort((jobA, jobB) => jobA.deadline - jobB.deadline);
      }
      if(queue.length > 0) {
        currentJob = queue[0];
      }
    }

    return {
      updatedCurrentJob: currentJob,
      updatedOverload: countOverload,
      stillOverloaded: overloaded
    };
  }

  public checkAndUpdateQueue(jobs: Process[], queue: Process[], timer: number): void {
    for(let i = 0; i < jobs.length; i++) {
      if(timer === jobs[i].entryTime) {
        queue.push(jobs[i]);
      }
    }
  }

}
