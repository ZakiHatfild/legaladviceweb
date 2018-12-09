import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ChatService } from 'app/main/lawyer/chat.service';

@Component({
    selector     : 'chat-view',
    templateUrl  : './chat-view.component.html',
    styleUrls    : ['./chat-view.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatViewComponent implements OnInit, OnDestroy, AfterViewInit
{
    user: any;
    chat: any;
    dialog: any;
    contact: any;
    replyInput: any;
    selectedChat: any;
    messages: any;

    @ViewChild(FusePerfectScrollbarDirective)
    directiveScroll: FusePerfectScrollbarDirective;

    @ViewChildren('replyInput')
    replyInputField;

    @ViewChild('replyForm')
    replyForm: NgForm;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ChatService} _chatService
     */
    constructor(
        private _chatService: ChatService
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.user = JSON.parse(localStorage.getItem('currentUser'));

        this.dialog = new Array();

        this._chatService.onChatSelected
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(chatData => {
                if ( chatData )
                {
                    this.selectedChat = chatData;
                    this.contact = chatData.contact;

                    if ( chatData.dialog )
                        {
                            this.dialog = new Array();
                            this.messages = chatData.dialog;

                            this.messages.requests.forEach(element => {

                                let message2 = {
                                    who    : element.fromUserId,
                                    message: element.question,
                                    time   : new Date(element.questionDateTime)
                                };
                                this.dialog.push(message2);

                                if (element.reply) {
                                let message = {
                                    who    : 0,
                                    message: element.reply,
                                    time   : new Date(element.replyDateTime)
                                };
                                this.dialog.push(message);
                            }
                            });

                            if (this.messages.lastQuestionSimilarReply && !this.replyForm.form.value.message && !this.dialog[this.dialog.length-1].reply) {
                                //document.getElementById("INSERTHERE").value = this.messages.lastQuestionSimilarReply;
                                this.replyForm.form.setValue({'message': this.messages.lastQuestionSimilarReply});
                            }
                            if (this.replyForm.form.value.message == this.dialog[this.dialog.length-1].reply) {
                                this.replyForm.reset();
                            }
                        }
                    this.readyToReply();
                }
            });

            this._chatService.onDialogChanged
            .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(dialog => {
                    if ( dialog )
                    {
                        this.dialog = new Array();
                        this.messages = dialog[0];

                        this.messages.requests.forEach(element => {

                            let message2 = {
                                who    : element.fromUserId,
                                message: element.question,
                                time   : new Date(element.questionDateTime)
                            };
                            this.dialog.push(message2);

                            if (element.reply) {
                             let message = {
                                who    : 0,
                                message: element.reply,
                                time   : new Date(element.replyDateTime)
                            };

                            this.dialog.push(message);
                        }
    
                        });
                        if (this.messages.lastQuestionSimilarReply && !this.replyForm.form.value.message && !this.dialog[this.dialog.length-1].reply) {
                            //document.getElementById("INSERTHERE").value = this.messages.lastQuestionSimilarReply;
                            this.replyForm.form.setValue({'message': this.messages.lastQuestionSimilarReply});
                        }
                        if (this.replyForm.form.value.message == this.dialog[this.dialog.length-1].reply) {
                            this.replyForm.reset();
                        }
                        this.readyToReply();
                    }
                });
    }

    /**
     * After view init
     */
    ngAfterViewInit(): void
    {
        this.replyInput = this.replyInputField.first.nativeElement;
        this.readyToReply();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Decide whether to show or not the contact's avatar in the message row
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    shouldShowContactAvatar(message, i): boolean
    {
        return (
            message.who === this.contact.id &&
            ((this.dialog[i + 1] && this.dialog[i + 1].who !== this.contact.id) || !this.dialog[i + 1])
        );
    }

    /**
     * Check if the given message is the first message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isFirstMessageOfGroup(message, i): boolean
    {
        return (i === 0 || this.dialog[i - 1] && this.dialog[i - 1].who !== message.who);
    }

    /**
     * Check if the given message is the last message of a group
     *
     * @param message
     * @param i
     * @returns {boolean}
     */
    isLastMessageOfGroup(message, i): boolean
    {
        return (i === this.dialog.length - 1 || this.dialog[i + 1] && this.dialog[i + 1].who !== message.who);
    }

    /**
     * Select contact
     */
    selectContact(): void
    {
        this._chatService.selectContact(this.contact);
    }

    /**
     * Ready to reply
     */
    readyToReply(): void
    {
        setTimeout(() => {
            this.focusReplyInput();
            this.scrollToBottom();
        });
    }

    /**
     * Focus to the reply input
     */
    focusReplyInput(): void
    {
        setTimeout(() => {
            this.replyInput.focus();
        });
    }

    /**
     * Scroll to the bottom
     *
     * @param {number} speed
     */
    scrollToBottom(speed?: number): void
    {
        speed = speed || 400;
        if ( this.directiveScroll )
        {
            this.directiveScroll.update();

            setTimeout(() => {
                this.directiveScroll.scrollToBottom(0, speed);
            });
        }
    }

    /**
     * Reply
     */
    reply(event): void
    {
        event.preventDefault();

        if ( !this.replyForm.form.value.message )
        {
            return;
        }

        // Message
        const message = {
            who    : this.user.id,
            message: this.replyForm.form.value.message,
            time   : new Date().toISOString()
        };

        // Add the message to the chat
        this.dialog.push(message);

        // Update the server
        this._chatService.updateDialog(this.replyForm.form.value.message).then(response => {
            this.readyToReply();
        });

        this.replyForm.reset();
    }
}
