import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileRoutingModule } from './profile-routing/profile-routing.module';
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [ProfileComponent],
    imports: [CommonModule, ProfileRoutingModule, SharedModule]
})
export class ProfileModule {}
