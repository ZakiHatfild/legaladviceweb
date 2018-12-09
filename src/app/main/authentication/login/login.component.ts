import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';

import { LoginService } from 'app/main/authentication/login/login.service';
import { ErrorSnackBarComponent } from 'app/shared/error-snackbar/error-snackbar.component';

import { locale as english } from 'app/main/authentication/i18n/en';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
  MatDialog
} from '@angular/material';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    authMessageStatus: string = 'None';

    horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';

    constructor(
        public snackBar: MatSnackBar,
        public dialog: MatDialog,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private router: Router,
        private _loginService: LoginService,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder
    )
    {
        this._fuseTranslationLoaderService.loadTranslations(english);
        
        this._fuseConfigService.config = {
            layout: {
                width    : 'fullwidth',
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        localStorage.removeItem('currentUser');
    }

    login(): void 
    {
        this.authMessageStatus = 'Loading';

        this._loginService.login(
            this.loginForm.controls['email'].value,
            this.loginForm.controls['password'].value,
            this.loginForm.controls['rememberMe'].value)
        .then(resp => {

            this.authMessageStatus = 'Success';
            localStorage.setItem('currentUser', JSON.stringify(resp));

            setTimeout(() => {

                if (resp.isEmployee) {
                    this.router.navigate(['/employee']);
                } else {
                    this.router.navigate(['/lawyer']);
                }
                
            }, 700); 
        })
        .catch((error) => {
            this.authMessageStatus = 'Error';

            this.snackBar.openFromComponent(ErrorSnackBarComponent, {
                duration: 2000,
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
            });
        })
    }

    ngOnInit(): void
    {
        this.loginForm = this._formBuilder.group({
            email      : ['', [Validators.required, Validators.email]],
            password   : ['', Validators.required],
            rememberMe : [false]
        });
    }
}
