import {atom} from 'recoil';
import {CreateUserDto} from '../api/interfaces/UserDto.ts';

export const createUserAtom = atom<CreateUserDto | null>({
  key: 'createUser',
  default: null,
});

export const creatingUserAtom = atom<boolean>({
  key: 'creatingUser',
  default: false,
});

export interface companyFilterAtom {
  companyTypes: string[];
  location: string;
}

export const companyFilterAtom = atom<companyFilterAtom>({
  key: 'companyFilter',
  default: undefined,
});

export const activeSideBarAtom = atom<'1' | '2' | '3' | '4' | '5' | undefined>({
  key: 'activeSideBarAtom',
  default: undefined,
});

export const overlayActiveAtom = atom<boolean>({
  key: 'overlayActiveAtom',
  default: false,
});
