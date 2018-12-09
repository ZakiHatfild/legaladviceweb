import { Injectable } from '@angular/core';
import { HttpClient } from 'app/core/http.client';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Profile } from 'app/models/profile.model';

@Injectable()
export class LoginService 
{
	constructor(
        private _httpClient: HttpClient
    )
    {}

    login(email, password, rememberMe): Promise<Profile> 
    {
		return new Promise((resolve, reject) => {

            var model = {
                email: email,
                password: password,
                remember: rememberMe
            };

            this._httpClient.post('login', model)	
                .subscribe((response: any) => {
                    var buf = response.json()
  
                    resolve(new Profile(buf));
                    
                }, reject);

        });
    }
}