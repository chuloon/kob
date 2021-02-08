import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SetupComponent } from './setup/setup.component';
import { FormsModule } from '@angular/forms';
import { PoolPlayComponent } from './pool-play/pool-play.component';

@NgModule({
  declarations: [
    AppComponent,
    SetupComponent,
    PoolPlayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
