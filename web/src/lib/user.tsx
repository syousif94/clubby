import { BehaviorSubject } from 'rxjs';

class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

type OptionalUser = User | undefined;

export const user$ = new BehaviorSubject<OptionalUser>(undefined);

export function initializeUser(initialName?: string): OptionalUser {
  if (initialName) {
    return new User(initialName);
  } else if ((window as any).DATA?.user) {
    const name: string = (window as any).DATA.user.name;
    const u = new User(name);
    user$.next(u);
  }
  return undefined;
}
