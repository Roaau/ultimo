import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AchivementsComponent } from './achivements.component';
import { CertificatesService } from '../../services/certificates.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('AchivementsComponent', () => {
  let component: AchivementsComponent;
  let fixture: ComponentFixture<AchivementsComponent>;
  let certificatesService: jasmine.SpyObj<CertificatesService>;

  beforeEach(() => {
    // Crear un mock del servicio
    certificatesService = jasmine.createSpyObj('CertificatesService', [
      'createCertificate',
      'getCertificates',
      'deleteCertificate',
    ]);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AchivementsComponent],
      providers: [
        { provide: CertificatesService, useValue: certificatesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AchivementsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call certificatesService.createCertificate and reset the form', () => {
      const certificateForm = { 
        value: { 
          idCertificates: 1, 
          institution: 'University', 
          year: 2020, 
          title: 'Bachelor' 
        },
        resetForm: jasmine.createSpy('resetForm')
      };

      certificatesService.createCertificate.and.returnValue(of({}));

      component.onSubmit(certificateForm);

      expect(certificatesService.createCertificate).toHaveBeenCalledWith(1, 'University', 2020, 'Bachelor');
      expect(certificateForm.resetForm).toHaveBeenCalled();
    });

    it('should log error if required fields are missing', () => {
      const certificateForm = { value: { idCertificates: undefined, institution: '', year: undefined, title: '' } };
      spyOn(console, 'error');

      component.onSubmit(certificateForm);

      expect(console.error).toHaveBeenCalledWith('All fields are required.');
    });
  });

  describe('queryCertificates', () => {
    it('should load certificates on init', () => {
      const mockCertificates = [
        { id: 1, institution: 'University', year: 2020, title: 'Bachelor' },
        { id: 2, institution: 'College', year: 2021, title: 'Master' }
      ];
      certificatesService.getCertificates.and.returnValue(of(mockCertificates));

      component.queryCertificates();

      expect(component.certificates).toEqual(mockCertificates);
      expect(certificatesService.getCertificates).toHaveBeenCalled();
    });

    it('should log error if fetching certificates fails', () => {
      spyOn(console, 'error');
      certificatesService.getCertificates.and.returnValue(throwError('Error'));

      component.queryCertificates();

      expect(console.error).toHaveBeenCalledWith('Error fetching certificates:', 'Error');
    });
  });

  describe('deleteCertificate', () => {
    it('should call certificatesService.deleteCertificate', () => {
      certificatesService.deleteCertificate.and.returnValue(of({}));
      component.deleteCertificate(1);

      expect(certificatesService.deleteCertificate).toHaveBeenCalledWith(1);
    });

    it('should log error if deleting certificate fails', () => {
      spyOn(console, 'error');
      certificatesService.deleteCertificate.and.returnValue(throwError('Error'));

      component.deleteCertificate(1);

      expect(console.error).toHaveBeenCalledWith('Error deleting certificate:', 'Error');
    });
  });
});
