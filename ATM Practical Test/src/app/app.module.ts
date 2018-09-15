import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { CardUserComponent } from './card-user/card-user.component';
import { WithdrwalComponent } from './withdrwal/withdrwal.component';
import { TransactionDetailsComponent } from './transactionDetails/transactionDetails.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';




import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule
} from "@angular/material";

const appRoutes: Routes = [
  {
    path: 'card-user',
    component: CardUserComponent,
    data: { title: 'card-user' }
  },
  {
    path: 'withdrwals/:id',
    component: WithdrwalComponent,
    data: { title: 'withdrwals' }
  },
  {
    path: 'transaction/:id',
    component: TransactionDetailsComponent,
    data: { title: 'transaction' }
  },
  {
    path: '',
    redirectTo: '/card-user',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    CardUserComponent,
    WithdrwalComponent,
    TransactionDetailsComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    CalendarModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
