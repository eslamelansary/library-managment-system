import { Permissions } from '../entities/role.entity';

export const Entities = {
  USER: 'user',
  ROLE: 'role',
  BOOK: 'book',
};

export const DefaultActions: string[] = [
  'create',
  'read_one',
  'read_all',
  'update',
  'delete',
];

export const bookPermissions = {
  [Entities.BOOK]: [...DefaultActions, 'borrow', 'return'],
};

export const userPermissions = {
  [Entities.USER]: [...DefaultActions],
};

export const rolePermissions = {
  [Entities.ROLE]: [...DefaultActions],
};

export const fullAccessRole: Permissions = Object.values(Entities).reduce(
  (acc, entity) => {
    acc[entity] = [...DefaultActions];
    return acc;
  },
  {} as Permissions,
);

export const CustomerRole = {
  book: ['read_one', 'read_all', 'borrow', 'return'],
  role: ['read_all'],
  user: ['read_one'],
};
