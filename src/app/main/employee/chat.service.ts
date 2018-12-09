import { Injectable } from '@angular/core';
import { HttpClient } from 'app/core/http.client';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

@Injectable()
export class ChatService implements Resolve<any>
{
    user: any;
    onChatSelected: BehaviorSubject<any>;
    onContactSelected: BehaviorSubject<any>;
    onDialogChanged: Subject<any>;
    onChatsUpdated: Subject<any>;
    onUserUpdated: Subject<any>;
    onLeftSidenavViewChanged: Subject<any>;
    onRightSidenavViewChanged: Subject<any>;

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
        this.onDialogChanged = new Subject();
        this.onChatsUpdated = new Subject();
        this.onUserUpdated = new Subject();
        this.onLeftSidenavViewChanged = new Subject();
        this.onRightSidenavViewChanged = new Subject();
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
                this.getUser(),
                this.getDialog()
            ]).then(
                ([user, dialog]) => {
                    this.user = user;
                    this.dialogChanges();
                    resolve();
                },
                reject
            );
        });
    }

    getDialog() {
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
            ([dialog]) => {
                
                this.onDialogChanged.next(dialog);
            }
        );
    }

    dialogChanges() {
        setInterval(() => {
            var action = new Promise((resolve, reject) => {
                this._httpClient.get('requests?userId=' + this.user.id)
                    .subscribe(dialog => {
                        resolve(dialog.json());
                    }, reject);
            });

            Promise.all([
                action
            ]).then(
                ([dialog]) => {
                    
                    this.onDialogChanged.next(dialog);
                }
            );
        }, 1000)
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
                userId: this.user.id,
                q: message
            };
            this._httpClient.post('questions?userId=' + data.userId + '&q=' + data.q, null)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
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
