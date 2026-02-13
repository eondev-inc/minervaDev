import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Si el usuario está autenticado entonces permitir acceder al dashboard
 */
export const authGuard: CanActivateFn = async () => {
	const authService = inject(AuthenticationService);
	return await authService.isAuthenticated();
};
