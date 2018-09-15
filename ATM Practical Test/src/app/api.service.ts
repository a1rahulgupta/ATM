import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const apiUrl = "http://localhost:3001/api/";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');
  };

  private extractData(res: Response) {
    let body = res;
    return body || { };
  }

  cashWithdrwal(data: string): Observable<any> {
    const url = apiUrl+'cashWithdrwal';
    return this.http.post(url,data, httpOptions).pipe(
      map(this.extractData),
      catchError(this.handleError));
  }

  checkCardInfo(data): Observable<any> {
    const url = apiUrl+'checkCardInfo';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTransactionDetails(data): Observable<any> {
    const url = apiUrl+'getTransactionDetails';
    return this.http.post(url, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
}
