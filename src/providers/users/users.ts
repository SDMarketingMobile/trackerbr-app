import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class UsersProvider {
	private API_URL = 'http://www.webliniaerp.com.br/api';

	constructor(public http: Http) { }

	getAll(id_empreendimento:number, offset: number, limit: number) {
		return new Promise((resolve, reject) => {
			let url = this.API_URL + '/usuarios/'+ offset +'/'+ limit +'?tue->id_empreendimento='+ id_empreendimento;

			this.http.get(url)
				.subscribe((result: any) => {
					resolve(result.json());
				},
				(error) => {
					reject(error.json());
				});
		});
	}
}