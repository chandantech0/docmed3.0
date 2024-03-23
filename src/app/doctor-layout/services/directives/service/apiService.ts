import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
// 3rd party libraries
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
// environment


@Injectable({
    providedIn: 'root'
})
export class ApiService {
  options: any;
  host = '';
  baseApiUrl = '';

  constructor(
    private httpClient: HttpClient
  ) {
    this.baseApiUrl = environment.apiBaseUrl;
    this.options = {
      // headers: this.headers,
      observe: 'body',
      withCredentials: false
    };
  }

  public post<T>(endPoint: string, data: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .post<T>(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): (Observable<any>) =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public get<T>(endPoint: string, params?: HttpParams): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .get<T>(endPointUrl, {...this.options, params})
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public getById<T>(endPoint: string, id: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint + '/' + id;
    return this.httpClient
      .get<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }


  public put<T>(endPoint: string, data: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .put(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public patch<T>(endPoint: string, data?: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint;
    return this.httpClient
      .patch(endPointUrl, data, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public delete<T>(endPoint: string, id?: any): Observable<T> {
    const endPointUrl = this.baseApiUrl + endPoint + (id ? '/' + id : '');
    return this.httpClient
      .delete<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }

  public search<T>(endPoint: string, searchTerm: string) {
    const endPointUrl = this.baseApiUrl + endPoint + '?search=' + searchTerm;
    return this.httpClient
      .get<T>(endPointUrl, this.options)
      .pipe(
        catchError(
          ({error}): Observable<any> =>
            throwError(error || 'server error: api call failed')
        )
      );
  }
}
