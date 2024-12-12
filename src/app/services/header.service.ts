import { SessionService } from './session.service';
import { map, catchError } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HeaderService {

  constructor(private apollo: Apollo, private sessionService: SessionService) { }

  private CREATE_OR_UPDATE_HEADER_MUTATION = gql`
  mutation CreateOrUpdateHeader($title: String!, $name: String!, $description: String!, $phone: String!, $address:String!, $email:String!, $socialmedia:String!, $url:String!) {
    createOrUpdateHeader(title: $title, name: $name, description: $description, phone:$phone, address:$address, email:$email, socialmedia:$socialmedia, url:$url) {
      idHeader
      title
      name
      url
      description
      phone
      address
      email
      socialmedia
      postedBy {
        username
      }
    }
  }
  `;

  createOrUpdateHeader(
    title: string,
    name: string,
    description: string,
    phone: string,
    address: string,
    email: string,
    socialmedia: string,
    url: string
  ): Observable<any> {
    return this.apollo.mutate({
      mutation: this.CREATE_OR_UPDATE_HEADER_MUTATION,
      variables: {
        title,
        name,
        description,
        phone,
        address,
        email,
        socialmedia,
        url
      },
      context: {
        headers: {
          'Authorization': `JWT ${this.sessionService.getToken()}`
        }
      }
    }).pipe(
      map((response: any) => {
        return response.data.createOrUpdateHeader;
      }),
      catchError((error) => {
        console.error('Error creating/updating header:', error);
        return error;
      })
    );
  }
}
