import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})

export class EducationService {
  constructor(private apollo: Apollo, private sessionService: SessionService) {}

  private CREATE_EDUCATION_MUTATION = gql`
    mutation MyMutation(
      $idEducation: Int!
      $degree: String!
      $university: String!
      $startDate: Date!
      $endDate: Date!
    ) {
      createEducation(
        idEducation: $idEducation
        degree: $degree
        university: $university
        startDate: $startDate
        endDate: $endDate
      ) {
        idEducation
        degree
        university
        startDate
        endDate
      }
    }
  `;

  private DELETE_EDUCATION_MUTATION = gql`
    mutation deleteEducation($idEducation: Int!) {
      deleteEducation(idEducation: $idEducation) {
        idEducation
      }
    }
  `;

  private EDUCATION_QUERY = gql`
    {
      degrees(search: "*") {
        id
        degree
        university
        startDate
        endDate
        postedBy {
          username
          password
        }
      }
    }
  `;

  createEducation(
    idEducation: number,
    degree: string,
    university: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.CREATE_EDUCATION_MUTATION,
        variables: { idEducation, degree, university, startDate, endDate },
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.createEducation),
        catchError((error) => {
          console.error('Error creating education:', error);
          return throwError(() => new Error('Failed to create education'));
        })
      );
  }

  getEducation(): Observable<any> {
    return this.apollo
      .query({
        query: this.EDUCATION_QUERY,
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.degrees),
        catchError((error) => {
          console.error('Error fetching education:', error);
          return throwError(() => new Error('Failed to fetch education'));
        })
      );
  }

  deleteEducation(idEducation: number): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.DELETE_EDUCATION_MUTATION,
        variables: { idEducation },
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.deleteEducation),
        catchError((error) => {
          console.error('Error deleting education:', error);
          return throwError(() => new Error('Failed to delete education'));
        })
      );
  }
}
