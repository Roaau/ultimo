import { SessionService } from './session.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class WorkExperienceService {
  constructor(private apollo: Apollo, private sessionService: SessionService) {}


  private CREATE_WORKEXPERIENCE_MUTATION = gql`
    mutation CreateWorkExperience(
      $idWorkExperience: Int!
      $company: String!
      $location: String!
      $endDate: String!
      $startDate: String!
      $position: String!
      $achievements: [String!]!
    ) {
      createWorkexperience(
        idWorkExperience: $idWorkExperience
        company: $company
        location: $location
        endDate: $endDate
        startDate: $startDate
        position: $position
        achievements: $achievements
      ) {
        company
        endDate
        position
        location
        idWorkExperience
        startDate
        achievements
      }
    }
  `;

  private WORKEXPERIENCE_QUERY = gql`
  {
    positions(search: "*") {
      company
      endDate
      position
      location
      achievements
      id
      startDate
      postedBy
      {
      username
      password
      }
    }
  }
  `;

  private DELETE_WORKEXPERIENCE_MUTATION = gql`
    mutation DeleteWorkExperience($idWorkExperience: Int!) {
      deleteWorkexperience(idWorkExperience: $idWorkExperience) {
        idWorkExperience
      }
    }
  `;

  createWorkExperience(
    idWorkExperience: number,
    company: string,
    location: string,
    endDate: String,
    startDate: String,
    position: string,
    achievements: string[]
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.CREATE_WORKEXPERIENCE_MUTATION,
        variables: {
          idWorkExperience,
          company,
          location,
          endDate,
          startDate,
          position,
          achievements,
        },
        context: {
          headers: {
            'Authorization': `JWT ${this.sessionService.getToken()}`
          }
        },
      })
      .pipe(
        map((result: any) => result.data.createWorkexperience),
        catchError((error) => {
          console.error('Error creating work experience:', error);
          return throwError(() => new Error('Failed to create work experience'));
        })
      );
  }

  getWorkExperiences(): Observable<any> {
    return this.apollo
      .query({
        query: this.WORKEXPERIENCE_QUERY,
        context: {
          headers: {
            'Authorization': `JWT ${this.sessionService.getToken()}`
          }
        }
      })
      .pipe(
        map((result: any) => result.data.positions),
        catchError((error) => {
          console.error('Error fetching work experiences:', error);
          return throwError(() => new Error('Failed to fetch work experiences'));
        })
      );
  }

  deleteWorkExperience(idWorkExperience: number): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.DELETE_WORKEXPERIENCE_MUTATION,
        variables: {
          idWorkExperience,
        },
        context: {
          headers: {
            'Authorization': `JWT ${this.sessionService.getToken()}`
          }
        }
      })
      .pipe(
        map((result: any) => result.data.deleteWorkexperience),
        catchError((error) => {
          console.error('Error deleting work experience:', error);
          return throwError(() => new Error('Failed to delete work experience'));
        })
      );
  }
}
