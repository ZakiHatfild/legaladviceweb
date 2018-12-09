import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { LoginModule } from 'app/main/authentication/login/login.module';

import { LoginComponent } from 'app/main/authentication/login/login.component';

const routes = [
    {
        path     : 'auth/login',
        component: LoginComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),

        LoginModule
    ],
    exports: [
        LoginModule
    ]
})
export class AuthenticationModule
{

}
