import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.css'],
  providers: [
    ToastrService
  ]
})
export class CardUserComponent implements OnInit {
  cardDetails: any;
  cardForm: FormGroup;
  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder, private toaster: ToastrService,
  ) { }

  ngOnInit() {

    this.cardForm = this.formBuilder.group({
      'pin': [null, [Validators.required, Validators.maxLength(4)]],
      'card_number': [null, [Validators.required, Validators.maxLength(16)]]
    });
  }

  onFormSubmit(form: NgForm) {
    let data = this.cardForm.value;
    this.api.checkCardInfo(data)
      .subscribe(res => {
        this.cardDetails = res.data.cardDetails;
        if (res.code == 200) {
          this.router.navigate(['/withdrwals/' + this.cardDetails._id]);
        } else {
          this.toaster.error(res.message);
        }
      }, (err) => {
        console.log(err);
      });
  }

}
