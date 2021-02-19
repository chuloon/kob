import { TournamentComponent } from './tournament/tournament.component';
import { PoolPlayComponent } from './pool-play/pool-play.component';
import { SetupComponent } from './setup/setup.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SetupComponent },
  { path: 'pool-play', component: PoolPlayComponent },
  { path: 'tournament', component: TournamentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
