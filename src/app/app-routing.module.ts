import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TesztComponent} from './components/teszt/teszt.component';
import {ChatInboxComponent} from './components/chat-inbox/chat-inbox.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {LoginComponent} from './components/login/login.component';
import {ProfileComponent} from './components/profile/profile.component';

const routes: Routes = [
  {path: '', component: TesztComponent},
  {path: 'client', component: TesztComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
