import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MatButtonModule, 
    MatDialogModule,  
    MatIconModule, 
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatBadgeModule
} from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseSidebarModule } from '@fuse/components';

import { ErrorSnackBarComponent } from 'app/shared/error-snackbar/error-snackbar.component';
import { AuthMessageComponent } from 'app/shared/auth-message/auth-message.component';

@NgModule({
    declarations   : [
        AuthMessageComponent,
        ErrorSnackBarComponent
    ],
    imports        : [
        MatButtonModule,
        MatDialogModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
    
        RouterModule,

        TranslateModule,

        FuseSharedModule,
        FuseSidebarModule,
    ],
    exports        : [
        AuthMessageComponent,
        ErrorSnackBarComponent
    ]
})
export class SharedModule
{
}
