import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'withdrwal',
  templateUrl: './withdrwal.component.html',
  styleUrls: ['./withdrwal.component.css']
})
export class WithdrwalComponent implements OnInit {
  transactionDetails: any;
  params: any = {
    amount: '',
    _id: '',
    withdrawalDate: new Date()
  }

  constructor(private router: Router,
    private route: ActivatedRoute, private api: ApiService, private formBuilder: FormBuilder, private toaster: ToastrService) {

  }

  ngOnInit() {
    this.params._id = this.route.snapshot.params['id']
  }

  cashWithdrwal(netAmount) {
    if (netAmount.amount % 100 != 0) {
      this.toaster.error('Incorrect Withdrawal Amount (not multiples of 100)');
      netAmount.amount = '';
    } else {
      this.api.cashWithdrwal(this.params)
        .subscribe(res => {
          if (res.code == 200) {
            this.transactionDetails = res.data.transactionDetails;
            this.router.navigate(['/transaction/' + this.transactionDetails._id]);
          } else {
            this.toaster.error(res.message);
            netAmount.amount = '';
          }
        }, (err) => {
          console.log(err);
        });
    }
  }
}
