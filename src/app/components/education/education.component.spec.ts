import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EducationComponent } from './education.component';
import { EducationService } from '../../services/education.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';

describe('EducationComponent', () => {
  let component: EducationComponent;
  let fixture: ComponentFixture<EducationComponent>;
  let educationService: jasmine.SpyObj<EducationService>;

  beforeEach(() => {
    // Crear un mock del servicio
    educationService = jasmine.createSpyObj('EducationService', [
      'createEducation',
      'getEducation',
      'deleteEducation',
    ]);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [EducationComponent],
      providers: [
        { provide: EducationService, useValue: educationService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EducationComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call educationService.createEducation and reset the form', () => {
      const educationForm = { 
        value: { 
          idEducation: 1, 
          degree: 'Bachelor of Science', 
          university: 'University of Example', 
          startDate: '2020-01-01', 
          endDate: '2024-01-01' 
        },
        resetForm: jasmine.createSpy('resetForm')
      };

      educationService.createEducation.and.returnValue(of({}));

      component.onSubmit(educationForm);

      expect(educationService.createEducation).toHaveBeenCalledWith(1, 'Bachelor of Science', 'University of Example', '2020-01-01', '2024-01-01');
      expect(educationForm.resetForm).toHaveBeenCalled();
    });

    it('should log error if required fields are missing', () => {
      const educationForm = { value: { idEducation: undefined, degree: '', university: '', startDate: '', endDate: '' } };
      spyOn(console, 'error');

      component.onSubmit(educationForm);

      expect(console.error).toHaveBeenCalledWith('All fields are required.');
    });
  });

  describe('queryEducation', () => {
    it('should load education records on init', () => {
      const mockDegrees = [
        { id: 1, degree: 'Bachelor of Science', university: 'University of Example', startDate: '2020-01-01', endDate: '2024-01-01' },
        { id: 2, degree: 'Master of Arts', university: 'Institute of Arts', startDate: '2018-01-01', endDate: '2022-01-01' }
      ];
      educationService.getEducation.and.returnValue(of(mockDegrees));

      component.queryEducation();

      expect(component.degrees).toEqual(mockDegrees);
      expect(educationService.getEducation).toHaveBeenCalled();
    });

    it('should log error if fetching education records fails', () => {
      spyOn(console, 'error');
      educationService.getEducation.and.returnValue(throwError('Error'));

      component.queryEducation();

      expect(console.error).toHaveBeenCalledWith('Error fetching education:', 'Error');
    });
  });

  describe('deleteEducation', () => {
    it('should call educationService.deleteEducation', () => {
      educationService.deleteEducation.and.returnValue(of({}));
      component.deleteEducation(1);

      expect(educationService.deleteEducation).toHaveBeenCalledWith(1);
    });

    it('should log error if deleting education record fails', () => {
      spyOn(console, 'error');
      educationService.deleteEducation.and.returnValue(throwError('Error'));

      component.deleteEducation(1);

      expect(console.error).toHaveBeenCalledWith('Error deleting education:', 'Error');
    });
  });
});
