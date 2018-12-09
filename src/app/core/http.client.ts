import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, ResponseContentType, Response, ResponseOptions, Request, RequestOptions, RequestOptionsArgs, XHRBackend} from '@angular/http';
import { Constants } from "app/app.constants";
import { environment } from 'environments/environment';
import { Observable } from 'rxjs/Rx'

// operators
import 'rxjs/add/observable/empty' 
import "rxjs/add/operator/catch"
import "rxjs/add/observable/throw"
import "rxjs/add/operator/map"

@Injectable()
export class HttpInspector extends Http 
{
    constructor(
        backend: XHRBackend,
        options: RequestOptions,
        public http: Http,
        private router: Router
    ) {
        super(backend, options)
    }

    public request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
        return super.request(url, options)
            .catch(this.handleError)
    }

    public handleError = (error: Response) => {  
        console.log(error);

        if (error.status == 401) {
            this.router.navigate(['/auth/login']);
        }

        return Observable.throw(error)
    }
}

@Injectable()
export class HttpClient {

    constructor(
        public http: HttpInspector,
    ) {}

    createAuthorizationHeader() {
        return new Headers();
    }

    delete(url) : Observable<Response> {
        let headers = this.createAuthorizationHeader();
        headers.append('Content-Type', Constants.Content_Type_JSON);
        
        return this.http.delete(environment.API_URL + url,
        {
            headers: headers
        });
    }

    get(url) : Observable<Response> {
        let headers = this.createAuthorizationHeader();
        headers.append('Content-Type', Constants.Content_Type_JSON);

        return this.http.get(environment.API_URL + url,
        {
            headers: headers
        });
    }

    post(url, data, isFile: boolean = false) : Observable<Response> {
        let headers = this.createAuthorizationHeader();
        if (!isFile) headers.append('Content-Type', Constants.Content_Type_JSON);

        return this.http.post(environment.API_URL + url,
            data,
            {
                headers: headers,
                method: 'POST',
                responseType: isFile ? ResponseContentType.Blob : ResponseContentType.Json
            });
    }

    put(url, data, isFile: boolean = false) : Observable<Response> {
        let headers = this.createAuthorizationHeader();
        if (!isFile) headers.append('Content-Type', Constants.Content_Type_JSON);
        //else headers.append('Content-Type', Constants.Content_Type_Form);

        return this.http.put(environment.API_URL + url,
            data,
            {
                headers: headers,
                method: 'PUT',
            });
    }
}