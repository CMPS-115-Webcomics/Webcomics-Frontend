import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'wcm-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  public message: string;

  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService
  ) {
    const token = this.route.snapshot.paramMap.get('token');
    this.message = 'Verification in process';
    auth.verifyEmail(token).then(() => {
      this.message = 'Your email has been verifed';
    }).catch((err) => {
      this.message = 'There was a problem verifying your email address.';
    });
  }

  ngOnInit() {
  }

}
