import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'transactionDetails',
  templateUrl: './transactionDetails.component.html',
  styleUrls: ['./transactionDetails.component.css'],
  providers: [
    ToastrService
  ]
})
export class TransactionDetailsComponent implements OnInit {
  TwoHundredNote: any;
  OneHundredNote: any;
  FiveHundredNote: any;
  TwoThousandNote: any;
  transactionDetails: any;
  params: any = {
    _id: '',
  }

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private toaster: ToastrService,
  ) { }

  ngOnInit() {

    this.params._id = this.route.snapshot.params['id']
    this.getTransactionDetails();
    this.sessionOut();

  }

  getTransactionDetails() {
    let data = this.params;
    this.api.getTransactionDetails(data)
      .subscribe(res => {
        if (res.code == 200) {
          this.transactionDetails = res.data.transactionDetails;
          this.TwoThousandNote = res.data.widthrawlTwoThousandNote;
          this.FiveHundredNote = res.data.widthrawlFiveHundredNote;
          this.TwoHundredNote = res.data.widthrawlTwoHundredNote;
          this.OneHundredNote = res.data.widthrawlOneHundredNote;
        } else {
          this.toaster.error(res.message);
        }
      }, (err) => {
        console.log(err);
      });
  }

  sessionOut(){
    setTimeout(() => {
      this.router.navigate(['']);
    }, 10000);
  }
}
