import { SkillsService } from '../../services/skills.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})

export class SkillsComponent {

  idSkill: number | undefined;
  name: string = '';
  skills: Array<{ id: number; name: string }> = []; 

  constructor(public skillsService: SkillsService) {
    this.querySkills();
  }

  onSubmit(skillForm: any) {
    this.idSkill = skillForm.value.idSkill;
    this.name = skillForm.value.name;
    this.skillsService.createSkills(this.idSkill!, this.name).subscribe({
      next: (response) => {
        console.log('Skill created:', response);
        skillForm.resetForm();
        this.querySkills();
      },
      error: (error) => {
        console.error('Error creating skill:', error);
      },
    });
  }

  querySkills() {
    this.skillsService.getSkills().subscribe({
      next: (response) => {
        this.skills = response; 
        console.log('Skills fetched:', this.skills);
      },
      error: (error) => {
        console.error('Error fetching skills:', error);
      },
    });
  }

  deleteSkill(idSkill: number) {
    const parseId = parseInt(idSkill.toString(), 10);
    this.skillsService.deleteSkills(parseId).subscribe({
      next: (response) => {
        console.log('Skill deleted:', response);
        this.querySkills();
      },
      error: (error) => {
        console.error('Error deleting skill:', error);
      },
    });
  }
}
