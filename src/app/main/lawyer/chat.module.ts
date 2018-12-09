import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
    MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatRadioModule, MatSidenavModule, MatToolbarModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ChatService } from 'app/main/lawyer/chat.service';
import { ChatComponent } from 'app/main/lawyer/chat.component';
import { ChatStartComponent } from 'app/main/lawyer/chat-start/chat-start.component';
import { ChatViewComponent } from 'app/main/lawyer/chat-view/chat-view.component';
import { ChatChatsSidenavComponent } from 'app/main/lawyer/sidenavs/left/chats/chats.component';
import { ChatUserSidenavComponent } from 'app/main/lawyer/sidenavs/left/user/user.component';
import { ChatLeftSidenavComponent } from 'app/main/lawyer/sidenavs/left/left.component';
import { ChatRightSidenavComponent } from 'app/main/lawyer/sidenavs/right/right.component';
import { ChatContactSidenavComponent } from 'app/main/lawyer/sidenavs/right/contact/contact.component';

const routes: Routes = [
    {
        path: '**',
        component: ChatComponent,
        children: [],
        resolve: {
            chat: ChatService
        }
    }
];

@NgModule({
    declarations: [
        ChatComponent,
        ChatViewComponent,
        ChatStartComponent,
        ChatChatsSidenavComponent,
        ChatUserSidenavComponent,
        ChatLeftSidenavComponent,
        ChatRightSidenavComponent,
        ChatContactSidenavComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatRadioModule,
        MatSidenavModule,
        MatToolbarModule,

        FuseSharedModule
    ],
    providers   : [
        ChatService
    ]
})
export class ChatModule
{
}
