import db from "../config/db";

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

export function getAllDB() {
  const dados = db.prepare('select * from pessoas').all();
  dados.map((dado: any) => dado.hobbies = dado.hobbies.split(','));
  return dados;
}

export function create(name: string, hobbies: string[]): void {
  // const person: Person = { id: nextId++, name, hobbies };
  // people.push(person);
  // return person;
  const pessoa = {
    name,
    email: `${name.toLowerCase().replaceAll(' ', '.')}@riogrande.ifrs.edu.br`,
    hobbies: hobbies.join(',')
  }

  const stmt = db.prepare('insert into pessoas (name, email, hobbies) values (@name, @email, @hobbies)');
  stmt.run(pessoa);
}
