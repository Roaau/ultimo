import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root'
})

export class LenguagesService {

  constructor(private apollo: Apollo, private sessionService: SessionService) {}

  private CREATE_LANGUAGES_MUTATION = gql`
    mutation MyMutation($idLanguages: Int!, $language: String!, $level: String!) {
      createLanguages(idLanguages: $idLanguages, language: $language, level: $level) {
        idLanguages
        language
        level
      }
    }
  `;

  private LANGUAGES_QUERY = gql`
    {
      languages(search: "*") {
        id
        language
        level
        postedBy {
          username
          password
        }
      }
    }
  `;

  private DELETE_LANGUAGES_MUTATION = gql`
    mutation DeleteLanguagesMutation($idLanguages: Int!) {
      deleteLanguages(idLanguages: $idLanguages) {
        idLanguages
      }
    }
  `;

  createLanguage(idLanguages: number, language: string, level: string): Observable<any> {
    return this.apollo.mutate({
      mutation: this.CREATE_LANGUAGES_MUTATION,
      variables: { idLanguages, language, level },
      context: {
        headers: { Authorization: `JWT ${this.sessionService.getToken()}` }
      }
    }).pipe(
      map((result: any) => result.data.createLanguages),
      catchError((error) => {
        console.error('Error creating language:', error);
        return throwError(() => new Error('Failed to create language'));
      })
    );
  }

  getLanguages(): Observable<any> {
    return this.apollo.query({
      query: this.LANGUAGES_QUERY,
      context: {
        headers: { Authorization: `JWT ${this.sessionService.getToken()}` }
      }
    }).pipe(
      map((result: any) => result.data.languages),
      catchError((error) => {
        console.error('Error fetching languages:', error);
        return throwError(() => new Error('Failed to fetch languages'));
      })
    );
  }

  deleteLanguage(idLanguages: number): Observable<any> {
    return this.apollo.mutate({
      mutation: this.DELETE_LANGUAGES_MUTATION,
      variables: { idLanguages },
      context: {
        headers: { Authorization: `JWT ${this.sessionService.getToken()}` }
      }
    }).pipe(
      map((result: any) => result.data.deleteLanguages),
      catchError((error) => {
        console.error('Error deleting language:', error);
        return throwError(() => new Error('Failed to delete language'));
      })
    );
  }
}
