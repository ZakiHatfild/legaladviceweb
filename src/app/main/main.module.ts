import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { AuthenticationModule } from './authentication/authentication.module';

import { AuthenticationGuard } from 'app/core/auth.guard'

const routes = [
    {
        path     : 'lawyer',
        loadChildren: './lawyer/chat.module#ChatModule',
        canActivate: [ AuthenticationGuard ]
    },
    {
        path     : 'employee',
        loadChildren: './employee/chat.module#ChatModule',
        canActivate: [ AuthenticationGuard ]
    },
    {
        path     : 'auth',
        loadChildren: './authentication/authentication.module#AuthenticationModule'
    },
    {
        path: '',  
        redirectTo: '/employee', 
        pathMatch: 'full'
    }
];

@NgModule({
    imports     : [
        RouterModule.forChild(routes),

        AuthenticationModule,

        TranslateModule,

        FuseSharedModule
    ],
    providers   : [
        AuthenticationGuard
    ]
})

export class MainModule
{
}
