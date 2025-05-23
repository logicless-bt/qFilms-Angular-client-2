import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://qfilms-e3cad25d1fad.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {
  // Inject the HttpClient module to the constructor params
 // This will provide HttpClient to the entire class, making it available via this.http
  constructor(
    private http: HttpClient
  ) {
  }
 // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
    catchError(this.handleError)
    );
  }

  /**
   * Login
   * @param userDetails 
   * @returns token
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Store token
        }
        return response;
      }),
      catchError(this.handleError),
    );
  }

  /**
  * retrieves one user's data, requires token
  * @returns JSON
  */
  public getUserData(): Observable<any> {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('user');
    return this.http
      .get(apiUrl + `users/${username}`, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * retrieves all movies from API
   * @returns JSON
   */
  public getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * retrieves information about one movie
   * @param MovieDetails 
   * @returns JSON
   */
  public getOneMovie(MovieDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + MovieDetails, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  /**
   * retrieves genre details and list of movies w/ that genre
   * @param GenreDetails 
   * @returns JSON
   */
  public getGenre(GenreDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `genre/${GenreDetails}`, {headers: new HttpHeaders(
      { Authorization: 'Bearer ' + token,

      }
    )}).pipe(
      map(this.extractResponseData), 
      catchError(this.handleError)
    );
  }

  /**
   * retrieves director bio and list of movies by director
   * @param DirectorDetails 
   * @returns JSON
   */
  public getDirector(DirectorDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `director/${DirectorDetails}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  /**
   * retrieves list of FavoriteMovies from API
   * @param ProfileDetails 
   * @returns JSON
   */
  public getFavMovies(ProfileDetails: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + `users/${ProfileDetails}/FavoriteMovies`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  /**
   * adds a favorite movie to FavoriteMovies in the API
   * @param ProfileDetails 
   * @param MovieDetails 
   * 
   */
  public addFavMovie(ProfileDetails: string, MovieDetails: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(apiUrl + `users/${ProfileDetails}/FavoriteMovies/${MovieDetails}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * deletes a favorited movie from FavoriteMovies in the API
   * @param ProfileDetails 
   * @param MovieDetails 
   */
  public deleteFavMovie(ProfileDetails: string, MovieDetails: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `users/${ProfileDetails}/FavoriteMovies/${MovieDetails}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * updates user details in the API
   * @param ProfileDetails 
   * @param newDetails
   */
  public editUserDetails(ProfileDetails: any, newDetails: any): Observable<any> { 
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + `users/${ProfileDetails}`, newDetails, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * deletes user
   * @param ProfileDetails 
   */
  public deleteUserDetails(ProfileDetails: any): Observable<any> { 
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + `users/${ProfileDetails}`, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      }
    )}).pipe(
      catchError(this.handleError)
    )
  }

  /**
   * handles errors
   * @param error 
   */
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
    console.error('Some error occurred:', error.error.message);
    } else {
    console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(
    'Something bad happened; please try again later.');
  }

  
/**
 * non-typed response extraction, used in getAllMovies()
 * @param res 
 * @returns JSON
 */
  private extractResponseData(res: any): any {
    const body = res;
    return body || { };
  }

  


}

