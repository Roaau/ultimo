import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsComponent } from './skills.component';
import { SkillsService } from '../../services/skills.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('SkillsComponent', () => {
  let component: SkillsComponent;
  let fixture: ComponentFixture<SkillsComponent>;
  let skillsService: jasmine.SpyObj<SkillsService>;

  beforeEach(() => {
    // Crear el mock de SkillsService
    skillsService = jasmine.createSpyObj('SkillsService', [
      'createSkills',
      'getSkills',
      'deleteSkills',
    ]);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [SkillsComponent],
      providers: [{ provide: SkillsService, useValue: skillsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SkillsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should call createSkills and update skills list on success', () => {
      const mockSkill = { id: 1, name: 'Angular' };
      skillsService.createSkills.and.returnValue(of(mockSkill)); // Simula éxito en la creación

      const skillForm = { value: { idSkill: 1, name: 'Angular' }, resetForm: jasmine.createSpy() };
      skillsService.getSkills.and.returnValue(of([mockSkill])); // Simula la consulta de habilidades

      component.onSubmit(skillForm);

      expect(skillsService.createSkills).toHaveBeenCalledWith(1, 'Angular');
      expect(skillForm.resetForm).toHaveBeenCalled();
      expect(component.skills).toEqual([mockSkill]);
    });

    it('should handle error when createSkills fails', () => {
      spyOn(console, 'error');
      skillsService.createSkills.and.returnValue(throwError('Error'));

      const skillForm = { value: { idSkill: 1, name: 'Angular' }, resetForm: jasmine.createSpy() };

      component.onSubmit(skillForm);

      expect(skillsService.createSkills).toHaveBeenCalledWith(1, 'Angular');
      expect(console.error).toHaveBeenCalledWith('Error creating skill:', 'Error');
    });
  });

  describe('querySkills', () => {
    it('should fetch skills from service', () => {
      const mockSkills = [{ id: 1, name: 'Angular' }];
      skillsService.getSkills.and.returnValue(of(mockSkills));

      component.querySkills();

      expect(skillsService.getSkills).toHaveBeenCalled();
      expect(component.skills).toEqual(mockSkills);
    });

    it('should handle error when getSkills fails', () => {
      spyOn(console, 'error');
      skillsService.getSkills.and.returnValue(throwError('Error'));

      component.querySkills();

      expect(console.error).toHaveBeenCalledWith('Error fetching skills:', 'Error');
    });
  });

  describe('deleteSkill', () => {
    it('should delete skill and update skills list', () => {
      const mockSkills = [{ id: 1, name: 'Angular' }];
      skillsService.getSkills.and.returnValue(of(mockSkills));
      skillsService.deleteSkills.and.returnValue(of(null)); // Simula éxito en la eliminación

      component.deleteSkill(1);

      expect(skillsService.deleteSkills).toHaveBeenCalledWith(1);
      expect(component.skills).toEqual(mockSkills);
    });

    it('should handle error when deleteSkills fails', () => {
      spyOn(console, 'error');
      skillsService.deleteSkills.and.returnValue(throwError('Error'));

      component.deleteSkill(1);

      expect(skillsService.deleteSkills).toHaveBeenCalledWith(1);
      expect(console.error).toHaveBeenCalledWith('Error deleting skill:', 'Error');
    });
  });
});
