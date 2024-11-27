import { Component, OnInit } from '@angular/core';
import { ReqUser } from 'src/app/auth/models/user';
import { NewUserService } from '../../services/new-user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  constructor(private newUserService: NewUserService) { }
  ngOnInit(): void {
  }

  newUser(user: ReqUser): void {
    this.newUserService.newUser(user);
  }

}
