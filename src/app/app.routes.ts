import { WorkExperienceComponent } from './components/work-experience/work-experience.component';
import { AchivementsComponent } from './components/achivements/achivements.component';
import { EducationComponent } from './components/education/education.component';
import { LenguagesComponent } from './components/lenguages/lenguages.component';
import { InterestsComponent } from './components/interests/interests.component';
import { SkillsComponent } from './components/skills/skills.component';
import { HeaderComponent } from './components/header/header.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { Routes } from '@angular/router';
import path from 'path';

export const routes: Routes = [
    { path: 'work-experience', component: WorkExperienceComponent, canActivate: [AuthGuard] },
    { path: 'achievements', component: AchivementsComponent, canActivate: [AuthGuard] },
    { path: 'education', component: EducationComponent, canActivate: [AuthGuard] },
    { path: 'lenguages', component: LenguagesComponent, canActivate: [AuthGuard] },
    { path: 'interests', component: InterestsComponent, canActivate: [AuthGuard] },
    { path: 'skills', component: SkillsComponent, canActivate: [AuthGuard] },
    { path: 'header', component: HeaderComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }, 
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: '/login' },
];
