import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from 'app/shared/i18n/en';


@Component({
  selector: 'error-snackbar',
  templateUrl: './error-snackbar.component.html',
  styleUrls    : ['./error-snackbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ErrorSnackBarComponent {
	constructor(
		private _fuseTranslationLoaderService: FuseTranslationLoaderService) 
	{ 
		this._fuseTranslationLoaderService.loadTranslations(english);
	}
}