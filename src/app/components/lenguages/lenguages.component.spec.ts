import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LenguagesComponent } from './lenguages.component';
import { LenguagesService } from '../../services/lenguages.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgForm } from '@angular/forms';

describe('LenguagesComponent', () => {
  let component: LenguagesComponent;
  let fixture: ComponentFixture<LenguagesComponent>;
  let languagesService: jasmine.SpyObj<LenguagesService>;

  beforeEach(() => {
    // Crear un mock del servicio
    languagesService = jasmine.createSpyObj('LenguagesService', ['createLanguage', 'getLanguages', 'deleteLanguage']);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [LenguagesComponent],
      providers: [
        { provide: LenguagesService, useValue: languagesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LenguagesComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call languagesService.createLanguage with correct data', () => {
      // Simulando los valores del formulario
      const languageForm = {
        value: { idLanguages: 1, language: 'Spanish', level: 'Intermediate' },
        valid: true,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;  // Usando Partial para simular solo las propiedades necesarias

      languagesService.createLanguage.and.returnValue(of({}));

      component.onSubmit(languageForm);

      expect(languagesService.createLanguage).toHaveBeenCalledWith(1, 'Spanish', 'Intermediate');
      expect(languageForm.resetForm).toHaveBeenCalled();
    });

    it('should log error if form is invalid', () => {
      spyOn(console, 'error');
      const languageForm = {
        value: { idLanguages: '', language: '', level: '' },
        valid: false,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;

      component.onSubmit(languageForm);

      expect(console.error).toHaveBeenCalledWith('All fields are required.');
    });

    it('should handle error when createLanguage fails', () => {
      spyOn(console, 'error');
      const languageForm = {
        value: { idLanguages: 1, language: 'Spanish', level: 'Intermediate' },
        valid: true,
        resetForm: jasmine.createSpy('resetForm')
      } as Partial<NgForm>;

      languagesService.createLanguage.and.returnValue(throwError('Error'));

      component.onSubmit(languageForm);

      expect(console.error).toHaveBeenCalledWith('Error creating language:', 'Error');
    });
  });

  describe('queryLanguages', () => {
    it('should update the languages list on success', () => {
      const mockLanguages = [
        { id: 1, language: 'Spanish', level: 'Intermediate' },
        { id: 2, language: 'English', level: 'Advanced' },
      ];
      languagesService.getLanguages.and.returnValue(of(mockLanguages));

      component.queryLanguages();

      expect(component.languages).toEqual(mockLanguages);
      expect(languagesService.getLanguages).toHaveBeenCalled();
    });

    it('should log error if getLanguages fails', () => {
      spyOn(console, 'error');
      languagesService.getLanguages.and.returnValue(throwError('Error'));

      component.queryLanguages();

      expect(console.error).toHaveBeenCalledWith('Error fetching languages:', 'Error');
    });
  });

  describe('deleteLanguage', () => {
    it('should call deleteLanguage and refresh the list on success', () => {
      const mockLanguageId = 1;
      languagesService.deleteLanguage.and.returnValue(of({}));
      languagesService.getLanguages.and.returnValue(of([])); // Simula la actualización de la lista

      component.deleteLanguage(mockLanguageId);

      expect(languagesService.deleteLanguage).toHaveBeenCalledWith(mockLanguageId);
      expect(languagesService.getLanguages).toHaveBeenCalled();
    });

    it('should log error if deleteLanguage fails', () => {
      spyOn(console, 'error');
      const mockLanguageId = 1;
      languagesService.deleteLanguage.and.returnValue(throwError('Error'));

      component.deleteLanguage(mockLanguageId);

      expect(console.error).toHaveBeenCalledWith('Error deleting language:', 'Error');
    });
  });
});
