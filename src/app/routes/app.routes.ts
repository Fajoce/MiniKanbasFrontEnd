import { Routes } from '@angular/router';
import { KanbanBoardComponent } from '../components/kanban/kanban-board/kanban-board.component';
import {  } from '../components/kanban/infraction-form/infraction-form.component';
import { InfractionListComponentComponent } from '../components/infraction-list-component/infraction-list-component.component';
import { authGuardGuard } from '../auth.guard.guard';
import { LoginComponentComponent } from '../components/login.component/login.component.component';
import { RegisterComponentComponent } from '../components/register.component/register.component.component';

export const routes: Routes = [
{ path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponentComponent },
  { path: 'register', component: RegisterComponentComponent },
  { path: 'kanban', component: KanbanBoardComponent, canActivate: [authGuardGuard] },
  { path: 'infractions', component: InfractionListComponentComponent, canActivate: [authGuardGuard] },
  { path: '**', redirectTo: 'login' }
];