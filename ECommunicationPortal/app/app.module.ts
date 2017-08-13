import { Component, NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { EmailComponent } from './components/email.component';
import { UserComponent } from './components/user.component';
import { HomeComponent } from './components/home.component';

@NgModule({
    imports: [Ng2Bs3ModalModule, BrowserModule, ReactiveFormsModule, FormsModule, HttpModule, routing],
    declarations: [AppComponent, EmailComponent, UserComponent, HomeComponent ],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
    bootstrap: [AppComponent]
})

export class AppModule { }