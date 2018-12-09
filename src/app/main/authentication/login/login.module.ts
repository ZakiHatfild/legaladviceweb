import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { 
    MatButtonModule, 
    MatCheckboxModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSnackBarModule, 
    MatDialogModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { SharedModule } from 'app/shared/shared.module';

import { LoginComponent } from 'app/main/authentication/login/login.component';
import { LoginService } from 'app/main/authentication/login/login.service';

import { TranslateModule } from '@ngx-translate/core';
import { ErrorSnackBarComponent } from 'app/shared/error-snackbar/error-snackbar.component';

@NgModule({
    declarations: [
        LoginComponent
    ],
    imports     : [
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        RouterModule,
        FuseSharedModule,
        MatSnackBarModule,
        MatDialogModule,

        TranslateModule,
        SharedModule
    ],
    providers   : [
        LoginService
    ],
    entryComponents : [
        ErrorSnackBarComponent
    ]
})
export class LoginModule
{
}
