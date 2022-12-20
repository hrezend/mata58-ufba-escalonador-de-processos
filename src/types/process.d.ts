export type Process = {
  id: number;
  entryTime: number;
  finalizedTime: number;
  executionTime: number;
  executedTimes: number;
  deadline: number;
  priority: number;
  pagesAmount: number;
  alreadyExecuted: boolean;
};
