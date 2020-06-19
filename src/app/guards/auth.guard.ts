import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthenticationService) {}
	/**
	 * Si el usuario está autenticado entonces permitir acceder al dashboard
	 */
	async canActivate(): Promise<boolean> {
		return await this.authService.isAuthenticated();
	}
}
