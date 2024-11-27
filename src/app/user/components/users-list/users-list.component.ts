import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserFront } from '../../models/user';
import { NewUserService } from '../../services/new-user.service';
import { UpdateUserService } from '../../services/update-user.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  users$: Observable<UserFront[] | any>;

  constructor(
    private newUserService: NewUserService,
    private userService: UserService,
    private updateUserService: UpdateUserService
    ) {
    this.users$ = this.userService.getUsers();
  }

  ngOnInit(): void {
    this.userService.getUsersCall();
  }

  edit(id: number): void {
    this.updateUserService.openDialog(id);
  }

  newUser(): void {
    this.newUserService.openDialog();
  }

}
