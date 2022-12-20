import { Process } from '../types/process';
import { FifoStrategy as FifoScheduler } from '../strategies/scheduler/FifoStrategy';
import { SjfStrategy as SjfScheduler } from '../strategies/scheduler/SjfStrategy';
import { EdfStrategy as EdfScheduler } from '../strategies/scheduler/EdfStrategy';
import { RrStrategy as RrScheduler } from '../strategies/scheduler/RrStrategy';

function calculateTurnAround(jobs: Process[]): number {
  return jobs.reduce((accum, job) => accum += (job.finalizedTime - job.entryTime + 1), 0) / jobs.length;
}
  
function isAllJobsFinalized(jobs: Process[]): boolean {
  if(jobs.length <= 0) {
    return false;
  }
  return jobs.every(job => job.alreadyExecuted === true);
}

function jobStrategyFactory(strategy: string): any {
  if(strategy === 'fifo') return new FifoScheduler();
  else if(strategy === 'sjf') return new SjfScheduler();
  else if(strategy === 'edf') return new EdfScheduler();
  else if(strategy === 'rr') return new RrScheduler();
}

function mockSomeJobs(maxJobs: number, minJobs: number): Process[] {
  const jobs: Process[] = [];
  const jobsAmount = Math.floor(Math.random() * (maxJobs - minJobs + 1)) + minJobs;

  for(let i = 0; i < jobsAmount; i++) {
    jobs.push({
      id: i,
      entryTime: Math.floor(Math.random() * 16),
      executionTime: Math.floor(Math.random() * 10) + 1,
      deadline: Math.floor(Math.random() * 30) + 1,
      priority: Math.floor(Math.random() * 5) + 1,
      pagesAmount: Math.floor(Math.random() * 10) + 1,
      alreadyExecuted: false,
      executedTimes: 0,
      finalizedTime: 0
    });
  }


  return jobs;
}

export { calculateTurnAround, isAllJobsFinalized, jobStrategyFactory, mockSomeJobs };
