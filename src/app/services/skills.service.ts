import { SessionService } from './session.service';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SkillsService {

  constructor(private apollo: Apollo, private sessionService: SessionService) { }

  private CREATE_SKILLS_MUTATION = gql`
  mutation MyMutation ($idSkills : Int!, $name: String!) {
    createSkills(idSkills: $idSkills, name: $name) {
      idSkills
      name
    }
  }
  `;

  private DELETE_SKILLS_MUTATION = gql`
  mutation DeleteSkillsMutation($idSkills: Int!) {
    deleteSkills(idSkills: $idSkills) {
      idSkills
    }
  }
  `;

  private SKILLS_QUERY = gql`
  {
    skills(search: "*") {
      id
      name
      postedBy
      {
      username
      password
      }
    }
  }
  `;



  createSkills(idSkills: number, name: string): Observable<any> {
    return this.apollo.mutate({
      mutation: this.CREATE_SKILLS_MUTATION,
      variables: {
        idSkills: idSkills,
        name: name
      },
      context: {
        headers: {
          Authorization: `JWT ${this.sessionService.getToken()}`}
      }
    }).pipe(
      map((result: any) => result.data.createSkills),
      catchError((error) => {
        console.error('Error creating skills:', error);
        return throwError(() => new Error('Failed to create skills'));
      })
    )
  }

  getSkills(): Observable<any> {
    return this.apollo.query({
      query: this.SKILLS_QUERY,
      context: {
        headers: {
          Authorization: `JWT ${this.sessionService.getToken()}`}
      }
    }).pipe(
      map((result: any) => result.data.skills),
      catchError((error) => {
        console.error('Error fetching skills:', error);
        return throwError(() => new Error('Failed to fetch skills'));
      })
    )
  }

  deleteSkills(idSkills: number): Observable<any> {
    return this.apollo.mutate({
      mutation: this.DELETE_SKILLS_MUTATION,
      variables: {
        idSkills: idSkills
      },
      context: {
        headers: {
          Authorization: `JWT ${this.sessionService.getToken()}`}
      }
    }).pipe(
      map((result: any) => result.data.deleteSkills),
      catchError((error) => {
        console.error('Error deleting skills:', error);
        return throwError(() => new Error('Failed to delete skills'));
      })
    )
  }
}
