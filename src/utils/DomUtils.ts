function initialColumnsAmountByScreenSize() {
  const width = window.innerWidth;

  if(width <= 720) return 5;
  if(width <= 1280) return 15;
  if(width <= 1920) return 25;
  if(width <= 2560) return 35;
  return 40;
}

function insertTimerColumn(time: number): void {
  const thead = document.getElementById('scheduler-table-head');
  const thClass = thead?.children[0].children[0].getAttribute('class');
  const newTh = document.createElement('th');
  newTh.setAttribute('id', `column-timer-${time}`);
  newTh.setAttribute('class', thClass ?? '');
  newTh.style.borderColor = '#cecece';
  newTh.style.borderWidth = '1px';
  newTh.innerHTML = time.toString();
  thead?.children[0].appendChild(newTh);

    
  const tbody = document.getElementById('scheduler-table-body');
  const tdClass = tbody?.children[0].children[0].getAttribute('class');

  if(tbody !== null) {
    for(let i = 0; i < tbody.children.length; i++) {
      const newTd = document.createElement('td');
      newTd.setAttribute('id', `job-${tbody?.children[i].children[0].textContent}-column-${time}`);
      newTd.setAttribute('class', tdClass ?? '');
      newTd.style.borderColor = '#cecece';
      newTd.style.borderWidth = '1px';
      newTd.style.background = 'transparent';
      tbody?.children[i].appendChild(newTd);
    }
  }
}

function colorSchedulerTableTimerCeil(time: number): void {
  const ceil = document.getElementById(`column-timer-${time}`);
    
  if(ceil != null) {
    ceil.style.backgroundColor = '#03223F';
    ceil.style.color = '#E19F41';
    ceil.style.borderWidth = '1px';
  }
}

function colorSchedulerTableJobCeil(id: number, time: number, color: string): void {
  const ceil = document.getElementById(`job-${id}-column-${time}`);
    
  if(ceil != null) {
    ceil.style.backgroundColor = color;
    ceil.style.borderColor = '#cecece';
    ceil.style.borderWidth = '1px';
  }
}

function printNameStrategy(text: string): void {
  const tag = document.getElementById('scheduler-content-title-name');

  if(tag !== null) {
    tag.innerHTML = text;
  }
}

function printInformationsStrategy(text: string): void {
  const tag = document.getElementById('scheduler-content-title-infos');
    
  if(tag !== null) {
    tag.innerHTML = text;
  }
}

function printTurnAround(value: number): void {
  const schedulerTableCapition = document.getElementById('text-turn-around');
  const answer = `turn around := ${value}`;

  if(schedulerTableCapition !== null) {
    schedulerTableCapition.innerHTML = answer;
  }
}

export { insertTimerColumn, colorSchedulerTableJobCeil, colorSchedulerTableTimerCeil, printTurnAround, printNameStrategy, printInformationsStrategy, initialColumnsAmountByScreenSize };
