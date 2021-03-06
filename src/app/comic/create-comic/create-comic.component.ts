import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ComicService } from '../comic.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { apiURL } from '../../url';
import { existenceValidator } from '../../existence.validator';
import { AuthenticationService } from '../../user/authentication.service';



@Component({
    selector: 'wcm-create-comic',
    templateUrl: './create-comic.component.html',
    styleUrls: ['./create-comic.component.scss']
})
export class CreateComicComponent implements OnInit {
    public title: string;
    public comicURL: string;
    public description: string;
    public tagline: string;
    public thumbnail: File;
    public organization = 'chapters';

    public name: FormControl;
    public url: FormControl;
    public desc: FormControl;
    public tag: FormControl;
    public working = false;

    @ViewChild('previewImg') previewImg: ElementRef;
    public previewSrc;
    public previewWidth;
    public previewHeight;

    constructor(
        private comicService: ComicService,
        private http: HttpClient
    ) {
        this.name = new FormControl('', [Validators.required],
            [existenceValidator(http, 'title')]);
        this.url = new FormControl('', [Validators.required, Validators.pattern(/^[a-z0-9\-]+$/)],
            [existenceValidator(http, 'comicURL')]);
        this.desc = new FormControl('', [Validators.required, Validators.maxLength(1000)]);
        this.tag = new FormControl('', [Validators.required, Validators.maxLength(30)]);
    }

    ngOnInit() {}

    titleChange(title: string) {
        if (!this.url.dirty)
            this.comicURL = this.title
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9\-]+/g, '');
    }

    isValid() {
        return this.name.valid && this.url.valid && this.desc.valid && this.thumbnail && this.tag.valid;
    }

    nameError() {
        return this.name.hasError('required') ? 'You must enter a value' :
            this.name.hasError('availability') ? 'That title is already in use.' :
                '';
    }

    urlError() {
        return this.url.hasError('required') ? 'You must enter a value.' :
            this.url.hasError('pattern') ? 'Only lower case letters, numbers and dashes may be used.' :
                this.url.hasError('availability') ? 'That URL is already in use.' :
                    '';
    }

    descError() {
        return this.desc.hasError('required') ? 'You must enter a value.' :
            this.desc.hasError('minlength') ? 'Must be at least 20 characters long.' :
                '';
    }

    tagError() {
        return this.desc.hasError('required') ? 'You must enter a value.' :
            '';
    }

    submitComic() {
        this.working = true;
        this.comicService.createComic(this.title, this.comicURL, this.organization, this.description, this.tagline, this.thumbnail)
            .then(() => this.working = false)
            .catch(() => this.working = false);
    }

    fileChange(event): void {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            this.thumbnail = fileList[0];
        }
        const reader = new FileReader();
        reader.onload = (e: any) => {
            this.previewSrc = e.target.result;
        };
        reader.readAsDataURL(this.thumbnail);
    }

}
