import { Request, Response } from 'express';
import * as PersonModel from '../models/PersonModel';

export function index(req: Request, res: Response): void {
  const filterName = (req.query.filterName as string || '').trim();
  const filterHobby = (req.query.filterHobby as string || '').trim();

  //const people = PersonModel.getAll(
  //  filterName || undefined,
  //  filterHobby || undefined,
  //);
  const people = PersonModel.getAllDB();

  res.render('home', {
    people,
    filterName: req.query.filterName || '',
    filterHobby: req.query.filterHobby || '',
  });
}

export function create(req: Request, res: Response): void {
  const name = (req.body.name || '').trim();
  const hobbies = (req.body.hobbies || '')
    .split(',')
    .map((h: string) => h.trim())
    .filter((h: string) => h.length > 0);

  if (name) {
    PersonModel.create(name, hobbies);
  }

  res.redirect('/');
}
