import { HeaderService } from '../../services/header.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  description: string = '';
  socialmedia: string = '';
  address: string = '';
  title: string = '';
  phone: string = '';
  email: string = '';
  name: string = '';
  url: string = '';

  constructor(private headerService: HeaderService) {}

  isFormValid(): boolean {
    if (
      (this.title ||
        this.description ||
        this.phone ||
        this.address ||
        this.email ||
        this.socialmedia ||
        this.name ||
        this.url) != ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.headerService
        .createOrUpdateHeader(
          this.title,
          this.name,
          this.description,
          this.phone,
          this.address,
          this.email,
          this.socialmedia,
          this.url
        )
        .subscribe({
          next: (response) => {
            console.log('Header created/updated successfully:', response);
            form.resetForm();
          },
          error: (error) => {
            console.error('Error:', error);
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }
}
