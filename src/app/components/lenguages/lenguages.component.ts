import { Component } from '@angular/core';
import { LenguagesService } from '../../services/lenguages.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lenguages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lenguages.component.html',
  styleUrl: './lenguages.component.css'
})

export class LenguagesComponent {
  idLanguages: number | undefined;
  language: string = '';
  level: string = '';
  languages: Array<{ id: number; language: string; level: string }> = [];

  constructor(private languagesService: LenguagesService) {
    this.queryLanguages();
  }

  onSubmit(languageForm: any) {
    const { idLanguages, language, level } = languageForm.value;

    if (!idLanguages || !language || !level) {
      console.error('All fields are required.');
      return;
    }

    this.languagesService.createLanguage(idLanguages, language, level).subscribe({
      next: (response) => {
        console.log('Language created:', response);
        languageForm.resetForm();
        this.queryLanguages();
      },
      error: (error) => {
        console.error('Error creating language:', error);
      }
    });
  }

  queryLanguages() {
    this.languagesService.getLanguages().subscribe({
      next: (response) => {
        this.languages = response;
        console.log('Languages fetched:', this.languages);
      },
      error: (error) => {
        console.error('Error fetching languages:', error);
      }
    });
  }

  deleteLanguage(idLanguages: number) {
    const parseId = parseInt(idLanguages.toString(), 10);
    this.languagesService.deleteLanguage(parseId).subscribe({
      next: (response) => {
        console.log('Language deleted:', response);
        this.queryLanguages();
      },
      error: (error) => {
        console.error('Error deleting language:', error);
      }
    });
  }
}
