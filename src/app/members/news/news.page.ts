import { Component, OnInit } from '@angular/core';

@Component({
	standalone: false,
	selector: 'app-news',
	templateUrl: './news.page.html',
	styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
	logo: string = '../../assets/img/minerva_login.png';
	constructor() {}

	ngOnInit() {}
}
