import { CanMatchFn } from '@angular/router';

export const isAdminGuard: CanMatchFn = (route, segments) => {
  return true; // todo implement this
};
