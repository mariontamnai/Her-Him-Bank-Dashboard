import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { supabase } from '../features/auth/login/supabase';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);

  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};