export interface Person {
  id: number;
  name: string;
  hobbies: string[];
}

const people: Person[] = [
  { id: 1, name: 'Guilherme', hobbies: ['games'] },
  { id: 2, name: 'Adriana', hobbies: ['leitura'] },
  { id: 3, name: 'Bruno', hobbies: ['musica'] },
];

let nextId = 4;

export function getAll(filterName?: string, filterHobby?: string): Person[] {
  let filtered = people;

  if (filterName) {
    filtered = filtered.filter(p => p.name.toLowerCase().includes(filterName.toLowerCase()));
  }

  if (filterHobby) {
    filtered = filtered.filter(p =>
      p.hobbies.some(h => h.toLowerCase().includes(filterHobby.toLowerCase()))
    );
  }

  return filtered;
}

export function create(name: string, hobbies: string[]): Person {
  const person: Person = { id: nextId++, name, hobbies };
  people.push(person);
  return person;
}
