import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'login',
		pathMatch: 'full',
	},
	{
		path: 'login',
		loadChildren: () => import('./public/login/login.module').then((m) => m.LoginPageModule),
	},
	{
		path: 'register',
		loadChildren: () => import('./public/register/register.module').then((m) => m.RegisterPageModule),
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadChildren: () => import('./members/dashboard/dashboard.module').then((m) => m.DashboardPageModule),
	},
	{
		path: 'recover',
		loadChildren: () => import('./public/recover/recover.module').then((m) => m.RecoverPageModule),
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
	exports: [RouterModule],
})
export class AppRoutingModule {}
