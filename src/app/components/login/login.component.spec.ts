import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Crear mocks de AuthService y Router
    authService = jasmine.createSpyObj('AuthService', ['authenticate']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    // Configuración del TestBed
    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('login', () => {
    it('should call authenticate and navigate on success', () => {
      const mockToken = 'mock-token';
      authService.authenticate.and.returnValue(of(mockToken)); // Simula éxito en la autenticación

      component.username = 'testuser';
      component.password = 'testpassword';

      component.login();

      expect(authService.authenticate).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(router.navigate).toHaveBeenCalledWith(['/header']);
    });

    it('should log an error if authentication fails', () => {
      spyOn(console, 'error');
      authService.authenticate.and.returnValue(throwError('Error'));

      component.username = 'testuser';
      component.password = 'testpassword';

      component.login();

      expect(authService.authenticate).toHaveBeenCalledWith('testuser', 'testpassword');
      expect(console.error).toHaveBeenCalledWith('Login failed:', 'Error');
    });
  });
});
