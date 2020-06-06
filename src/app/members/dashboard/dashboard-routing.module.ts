import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPage } from './dashboard.page';

const routes: Routes = [
	{
		path: '',
		component: DashboardPage,
		children: [
			{
				path: 'init',
				loadChildren: () => import('../init/init.module').then((m) => m.InitPageModule),
			},
			{
				path: 'store',
				loadChildren: () => import('../store/store.module').then((m) => m.StorePageModule),
			},
			{
				path: 'news',
				loadChildren: () => import('../news/news.module').then((m) => m.NewsPageModule),
			},
			{
				path: 'about',
				loadChildren: () => import('../about/about.module').then((m) => m.AboutPageModule),
			},
			{
				path: '',
				redirectTo: '/dashboard/init',
				pathMatch: 'full',
			},
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
