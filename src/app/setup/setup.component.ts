import { Pair } from './../classes/pair';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  private _numberOfPairs: number;
  get numberOfPairs(): number {
    return this._numberOfPairs;
  }

  set numberOfPairs(value: number) {
    this._numberOfPairs = value;

    this.pairInfo = [];
    for(let i = 0; i < value; i++) {
      this.pairInfo.push({ pairNumber: i+1, player1Name: "", player2Name: "", pointDifferential: 0 })
    }
  }
  
  pairInfo: Pair[] = [];
  poolPlayGameAmount: number;
  courtsAvailable: number;
  tournamentCount: number;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.pairInfo = JSON.parse(localStorage.getItem('pairInfo'));
    if(!this.pairInfo) this.pairInfo = [];
    this._numberOfPairs = this.pairInfo.length;
    if(this._numberOfPairs == 0) this.numberOfPairs = 16;

    this.poolPlayGameAmount = parseInt(localStorage.getItem('poolPlayGameAmount'));
    if(!this.poolPlayGameAmount) this.poolPlayGameAmount = 3;

    this.courtsAvailable = parseInt(localStorage.getItem('courtsAvailable'));
    if(!this.courtsAvailable) this.courtsAvailable = 6;

    this.tournamentCount = parseInt(localStorage.getItem('tournamentCount'));
    if(!this.tournamentCount) this.tournamentCount = 1;
  }

  startTournament = () => {
    this.savepairInfoToLocalStorage();
    this.router.navigateByUrl("/pool-play");
  }

  savepairInfoToLocalStorage = () => {
    let stringData: string = JSON.stringify(this.pairInfo);
    localStorage.setItem('pairInfo', stringData);
    localStorage.setItem('poolPlayGameAmount', this.poolPlayGameAmount.toString());
    localStorage.setItem('courtsAvailable', this.courtsAvailable.toString());
    localStorage.setItem('tournamentCount', this.tournamentCount.toString());
  }

}
