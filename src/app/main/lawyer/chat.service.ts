import { Injectable } from '@angular/core';
import { HttpClient } from 'app/core/http.client';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

@Injectable()
export class ChatService implements Resolve<any>
{
    contacts: any[];
    user: any;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onDialogChanged: Subject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;
    onContactsChanged: Subject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onChatSelected = new BehaviorSubject(null);
        this.onContactSelected = new BehaviorSubject(null);
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
        this.onDialogChanged = new Subject();
        this.onContactsChanged = new Subject();
    }

    getDialog(chatId) {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        var action = new Promise((resolve, reject) => {
            this._httpClient.get('requests?userId=' + user.id)
                .subscribe(dialog => {
                    resolve(dialog.json());
                }, reject);
        });

        Promise.all([
            action
        ]).then(
            (dialog: any) => {
                
                dialog[0].requests = dialog[0].requests.filter(el => { return el.fromUserId == chatId});
                return dialog[0];
            }
        );
    }

    dialogChanges() {
        setInterval(() => {
            var action = new Promise((resolve, reject) => {
                this._httpClient.get('requests?userId=' + this.user.id)
                    .subscribe(dialog => {
                        let data = dialog.json(); 
                        resolve(data);
                    }, reject);
            });

            Promise.all([
                action
            ]).then(
                (dialog: any) => {
                    let ids = new Array();
                    
                    if (!dialog)
                    return;

                    this.contacts = new Array();

                    dialog[0].requests.map(element => {
                        ids.push(element.fromUserId)
                        return element;
                    });
                    
                    let idSet = (ids) => ids.filter((v,i) => ids.indexOf(v) === i);
                    idSet(ids).forEach(el => {
                        let contact = {
                            id: el,
                            name: dialog[0].requests.find(elem => {return elem.fromUserId == el}).fromUser.name,
                            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Oleg_Zherebtsov.jpg/266px-Oleg_Zherebtsov.jpg',
                            status: 'online'
                        }

                        this.contacts.push(contact);
                    });
 
                    this.onContactsChanged.next(this.contacts);
                    this.onDialogChanged.next(dialog);
                }
            );
        }, 3000)
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getContacts(),
                this.getUser(),
                this.dialogChanges()
            ]).then(
                ([contacts, user]) => {
                    this.contacts = contacts;
                    this.user = user;
                    this.user.chatList = this.contacts;
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */
    getChat(contactId): Promise<any>
    {
        const chatItem = this.user.chatList.find((item) => {
            return item.contactId === contactId;
        });

        return new Promise((resolve, reject) => {

            const chatContact = this.contacts.find((contact) => {
                return contact.id === contactId;
            });

            var dialog = this.getDialog(contactId);
            var chatDat = {
                chatId: contactId,
                dialog: dialog,
                contact: chatContact
            }
            this.onChatSelected.next({...chatDat});
        });

    }

    /**
     * Create new chat
     *
     * @param contactId
     * @returns {Promise<any>}
     */

    /**
     * Select contact
     *
     * @param contact
     */
    selectContact(contact): void
    {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     *
     * @param status
     */
    setUserStatus(status): void
    {
        this.user.status = status;
    }

    /**
     * Update the chat dialog
     *
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    updateDialog(message): Promise<any>
    {
        return new Promise((resolve, reject) => {

            var data = {
                reply: message
            };

            this._httpClient.post('replies?reply=' + data.reply, null)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
        });
    }

    /**
     * Get contacts
     *
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    }

    /**
     * Get user
     *
     * @returns {Promise<any>}
     */
    getUser(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            let user = JSON.parse(localStorage.getItem('currentUser'));
            resolve(user);
        });
    }
}
