import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class CertificatesService {
  constructor(private apollo: Apollo, private sessionService: SessionService) {}

  private CREATE_CERTIFICATES_MUTATION = gql`
    mutation MyMutation(
      $idCertificates: Int!
      $institution: String!
      $year: Int!
      $title: String!
    ) {
      createCertificates(
        idCertificates: $idCertificates
        institution: $institution
        year: $year
        title: $title
      ) {
        idCertificates
        institution
        year
        title
      }
    }
  `;

  private DELETE_CERTIFICATES_MUTATION = gql`
    mutation DeleteCertificatesMutation($idCertificates: Int!) {
      deleteCertificates(idCertificates: $idCertificates) {
        idCertificates
      }
    }
  `;

  private CERTIFICATES_QUERY = gql`
    {
      certificates(search: "*") {
        id
        institution
        title
        year
        postedBy {
          username
          password
        }
      }
    }
  `;

  createCertificate(
    idCertificates: number,
    institution: string,
    year: number,
    title: string
  ): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.CREATE_CERTIFICATES_MUTATION,
        variables: { idCertificates, institution, year, title },
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.createCertificates),
        catchError((error) => {
          console.error('Error creating certificate:', error);
          return throwError(() => new Error('Failed to create certificate'));
        })
      );
  }

  getCertificates(): Observable<any> {
    return this.apollo
      .query({
        query: this.CERTIFICATES_QUERY,
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.certificates),
        catchError((error) => {
          console.error('Error fetching certificates:', error);
          return throwError(() => new Error('Failed to fetch certificates'));
        })
      );
  }

  deleteCertificate(idCertificates: number): Observable<any> {
    return this.apollo
      .mutate({
        mutation: this.DELETE_CERTIFICATES_MUTATION,
        variables: { idCertificates },
        context: {
          headers: { Authorization: `JWT ${this.sessionService.getToken()}` },
        },
      })
      .pipe(
        map((result: any) => result.data.deleteCertificates),
        catchError((error) => {
          console.error('Error deleting certificate:', error);
          return throwError(() => new Error('Failed to delete certificate'));
        })
      );
  }
}
