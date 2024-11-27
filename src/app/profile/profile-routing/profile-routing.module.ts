import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ProfileComponent },
      { path: '**', component: ProfileComponent, redirectTo: '' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
