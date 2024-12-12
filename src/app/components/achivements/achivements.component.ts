import { Component } from '@angular/core';
import { CertificatesService } from '../../services/certificates.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-achivements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './achivements.component.html',
  styleUrl: './achivements.component.css'
})

export class AchivementsComponent {
  idCertificates: number | undefined;
  institution: string = '';
  year: number | undefined;
  title: string = '';
  certificates: Array<{ id: number; institution: string; year: number; title: string }> = [];

  constructor(private certificatesService: CertificatesService) {
    this.queryCertificates();
  }

  onSubmit(certificateForm: any) {
    const { idCertificates, institution, year, title } = certificateForm.value;

    if (!idCertificates || !institution || !year || !title) {
      console.error('All fields are required.');
      return;
    }

    this.certificatesService.createCertificate(idCertificates, institution, year, title).subscribe({
      next: (response) => {
        console.log('Certificate created:', response);
        certificateForm.resetForm();
        this.queryCertificates();
      },
      error: (error) => {
        console.error('Error creating certificate:', error);
      },
    });
  }

  queryCertificates() {
    this.certificatesService.getCertificates().subscribe({
      next: (response) => {
        this.certificates = response;
        console.log('Certificates fetched:', this.certificates);
      },
      error: (error) => {
        console.error('Error fetching certificates:', error);
      },
    });
  }

  deleteCertificate(idCertificates: number) {
    const parseId = parseInt(idCertificates.toString(), 10);
    this.certificatesService.deleteCertificate(parseId).subscribe({
      next: (response) => {
        console.log('Certificate deleted:', response);
        this.queryCertificates();
      },
      error: (error) => {
        console.error('Error deleting certificate:', error);
      },
    });
  }
}
