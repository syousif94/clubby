import { BehaviorSubject } from 'rxjs';
import api from './api';

export const phone$ = new BehaviorSubject('');

export const phoneSubmitted$ = new BehaviorSubject(false);

export const code$ = new BehaviorSubject('');

export async function submitPhone() {
  try {
    await api('users/login', {
      phone: phone$.value,
    });
    phoneSubmitted$.next(true);
  } catch (error) {
    console.log(error);
  }
}

export async function submitCode() {
  try {
    const res = await api('users/login/complete', {
      phone: phone$.value,
      code: code$.value,
    });
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}
