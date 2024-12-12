import { SessionService } from './session.service';
import { map, catchError } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  constructor(
    private apollo: Apollo,
    private sessionService: SessionService
  ) {}

  private TOKEN_AUTH_MUTATION = gql`
    mutation TokenAuth($username: String!, $password: String!) {
      tokenAuth(username: $username, password: $password) {
        token
      }
    }
  `;

  authenticate(username: string, password: string): Observable<string> {
    return this.apollo
      .mutate<{ tokenAuth: { token: string } }>({
        mutation: this.TOKEN_AUTH_MUTATION,
        variables: { username, password },
      })
      .pipe(
        map((result) => {
          const token = result.data?.tokenAuth?.token;
          if (token) {
            this.sessionService.storeToken(token);
            return token;
          } else {
            throw new Error('Token not received');
          }
        }),
        catchError((error) => {
          console.error('Authentication error:', error);
          throw error;
        })
      );
  }
}
