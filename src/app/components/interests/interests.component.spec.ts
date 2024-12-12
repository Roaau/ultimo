import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InterestsComponent } from './interests.component';
import { InterestsService } from '../../services/interests.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

describe('InterestsComponent', () => {
  let component: InterestsComponent;
  let fixture: ComponentFixture<InterestsComponent>;
  let interestsService: jasmine.SpyObj<InterestsService>;

  beforeEach(() => {
    // Crear un mock del servicio
    interestsService = jasmine.createSpyObj('InterestsService', ['createInterest', 'getInterests', 'deleteInterest']);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [InterestsComponent],
      providers: [
        { provide: InterestsService, useValue: interestsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InterestsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call interestsService.createInterest with correct data', () => {
      // Simulando los valores del formulario
      const interestForm = {
        value: { idInterest: 1, name: 'Programming' },
        valid: true,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;  // Usamos Partial para simular solo las propiedades necesarias

      interestsService.createInterest.and.returnValue(of({}));

      component.onSubmit(interestForm);

      expect(interestsService.createInterest).toHaveBeenCalledWith(1, 'Programming');
      expect(interestForm.resetForm).toHaveBeenCalled();
    });

    it('should log error if form is invalid', () => {
      spyOn(console, 'error');
      const interestForm = {
        value: { idInterest: '', name: '' },
        valid: false,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;

      component.onSubmit(interestForm);

      expect(console.error).toHaveBeenCalledWith('Both idInterest and name are required.');
    });

    it('should handle error when createInterest fails', () => {
      spyOn(console, 'error');
      const interestForm = {
        value: { idInterest: 1, name: 'Programming' },
        valid: true,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;

      interestsService.createInterest.and.returnValue(throwError('Error'));

      component.onSubmit(interestForm);

      expect(console.error).toHaveBeenCalledWith('Error creating interest:', 'Error');
    });
  });

  describe('queryInterests', () => {
    it('should update the interests list on success', () => {
      const mockInterests = [
        { id: 1, name: 'Programming' },
        { id: 2, name: 'Music' },
      ];
      interestsService.getInterests.and.returnValue(of(mockInterests));

      component.queryInterests();

      expect(component.interests).toEqual(mockInterests);
      expect(interestsService.getInterests).toHaveBeenCalled();
    });

    it('should log error if getInterests fails', () => {
      spyOn(console, 'error');
      interestsService.getInterests.and.returnValue(throwError('Error'));

      component.queryInterests();

      expect(console.error).toHaveBeenCalledWith('Error fetching interests:', 'Error');
    });
  });

  describe('deleteInterest', () => {
    it('should call deleteInterest and refresh the list on success', () => {
      const mockInterestId = 1;
      interestsService.deleteInterest.and.returnValue(of({}));
      interestsService.getInterests.and.returnValue(of([])); // Simula la actualización de la lista

      component.deleteInterest(mockInterestId);

      expect(interestsService.deleteInterest).toHaveBeenCalledWith(mockInterestId);
      expect(interestsService.getInterests).toHaveBeenCalled();
    });

    it('should log error if deleteInterest fails', () => {
      spyOn(console, 'error');
      const mockInterestId = 1;
      interestsService.deleteInterest.and.returnValue(throwError('Error'));

      component.deleteInterest(mockInterestId);

      expect(console.error).toHaveBeenCalledWith('Error deleting interest:', 'Error');
    });
  });
});
