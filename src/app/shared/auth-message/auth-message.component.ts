import { Component, Inject, ViewEncapsulation, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'auth-message',
  templateUrl: './auth-message.component.html',
  styleUrls    : ['./auth-message.component.scss'],
  encapsulation: ViewEncapsulation.None,
})	
export class AuthMessageComponent {

	@Input('successMessage') successMessage: string;
  	@Input('errorMessage') errorMessage: string;
  	@Input('status') status: string;

	constructor() 
	{ 

	}

}