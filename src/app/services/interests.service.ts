import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})

export class InterestsService {
  constructor(private apollo: Apollo, private sessionService: SessionService) {}

  private CREATE_INTERESTS_MUTATION = gql`
    mutation MyMutation($idInterests: Int!, $name: String!) {
      createInterests(idInterests: $idInterests, name: $name) {
        idInterests
        name
      }
    }
  `;

  private INTERESTS_QUERY = gql`
    {
      interests(search: "*") {
        id
        name
        postedBy {
          username
          password
        }
      }
    }
  `;

  private DELETE_INTERESTS_MUTATION = gql`
    mutation DeleteInterestsMutation($idInterests: Int!) {
      deleteInterests(idInterests: $idInterests) {
        idInterests
      }
    }
  `;

  createInterest(idInterests: number, name: string): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.CREATE_INTERESTS_MUTATION,
        variables: { idInterests, name },
        context: {
          headers: {
            Authorization: `JWT ${this.sessionService.getToken()}`,
          },
        },
      })
      .pipe(
        map((result: any) => result.data.createInterests),
        catchError((error) => {
          console.error('Error creating interest:', error);
          return throwError(() => new Error('Failed to create interest'));
        })
      );
  }

  getInterests(): Observable<any> {
    return this.apollo
      .query({
        query: this.INTERESTS_QUERY,
        context: {
          headers: {
            Authorization: `JWT ${this.sessionService.getToken()}`,
          },
        },
      })
      .pipe(
        map((result: any) => result.data.interests),
        catchError((error) => {
          console.error('Error fetching interests:', error);
          return throwError(() => new Error('Failed to fetch interests'));
        })
      );
  }

  deleteInterest(idInterests: number): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.DELETE_INTERESTS_MUTATION,
        variables: { idInterests },
        context: {
          headers: {
            Authorization: `JWT ${this.sessionService.getToken()}`,
          },
        },
      })
      .pipe(
        map((result: any) => result.data.deleteInterests),
        catchError((error) => {
          console.error('Error deleting interest:', error);
          return throwError(() => new Error('Failed to delete interest'));
        })
      );
  }
}
