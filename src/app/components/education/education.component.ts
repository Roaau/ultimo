import { Component } from '@angular/core';
import { EducationService } from '../../services/education.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent {
  idEducation: number | undefined;
  degree: string = '';
  university: string = '';
  startDate: string = '';
  endDate: string = '';
  degrees: Array<{ id: number; degree: string; university: string; startDate: string; endDate: string }> = [];

  constructor(private educationService: EducationService) {
    this.queryEducation();
  }

  onSubmit(educationForm: any) {
    const { idEducation, degree, university, startDate, endDate } = educationForm.value;

    if (!idEducation || !degree || !university || !startDate || !endDate) {
      console.error('All fields are required.');
      return;
    }

    this.educationService
      .createEducation(idEducation, degree, university, startDate, endDate)
      .subscribe({
        next: (response) => {
          console.log('Education created:', response);
          educationForm.resetForm();
          this.queryEducation();
        },
        error: (error) => {
          console.error('Error creating education:', error);
        },
      });
  }

  queryEducation() {
    this.educationService.getEducation().subscribe({
      next: (response) => {
        this.degrees = response;
        console.log('Education fetched:', this.degrees);
      },
      error: (error) => {
        console.error('Error fetching education:', error);
      },
    });
  }

  deleteEducation(idEducation: number) {
    const parseId = parseInt(idEducation.toString(), 10);
    this.educationService.deleteEducation(parseId).subscribe({
      next: (response) => {
        console.log('Education deleted:', response);
        this.queryEducation();
      },
      error: (error) => {
        console.error('Error deleting education:', error);
      },
    });
  }
}
