import { InterestsService } from '../../services/interests.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-interests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interests.component.html',
  styleUrl: './interests.component.css'
})

export class InterestsComponent {
  idInterest: number | undefined;
  name: string = '';
  interests: Array<{ id: number; name: string }> = [];

  constructor(public interestsService: InterestsService) {
    this.queryInterests();
  }

  onSubmit(interestForm: any) {
    const idInterest = interestForm.value.idInterest; 
    const name = interestForm.value.name;
  
    if (!idInterest || !name) {
      console.error('Both idInterest and name are required.');
      return;
    }
  
    this.interestsService.createInterest(idInterest, name).subscribe({
      next: (response) => {
        console.log('Interest created:', response);
        interestForm.resetForm();
        this.queryInterests();
      },
      error: (error) => {
        console.error('Error creating interest:', error);
      },
    });
  }
  

  queryInterests() {
    this.interestsService.getInterests().subscribe({
      next: (response) => {
        this.interests = response;
        console.log('Interests fetched:', this.interests);
      },
      error: (error) => {
        console.error('Error fetching interests:', error);
      },
    });
  }

  deleteInterest(idInterest: number) {
    const parseId = parseInt(idInterest.toString(), 10);
    this.interestsService.deleteInterest(parseId).subscribe({
      next: (response) => {
        console.log('Interest deleted:', response);
        this.queryInterests();
      },
      error: (error) => {
        console.error('Error deleting interest:', error);
      },
    });
  }
}