import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReqUser, User } from 'src/app/auth/models/user';
import { UpdateUserService } from '../../services/update-user.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {

  user: User | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public userId: number,
    private userService: UserService,
    private updateUserService: UpdateUserService
    ) { }

  ngOnInit(): void {
    this.userService.getUser(this.userId)
    .subscribe( user => {
      if(user) {
        this.user = user;
      }
    })
  }

  update(user: ReqUser): void {
    if(this.user?.idusuario)
    this.updateUserService.updateUser(this.user?.idusuario, user);
  }

}
