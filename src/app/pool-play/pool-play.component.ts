import { Team } from './../classes/team';
import { Pair } from './../classes/pair';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-pool-play',
  templateUrl: './pool-play.component.html',
  styleUrls: ['./pool-play.component.scss']
})
export class PoolPlayComponent implements OnInit {
  pairInfo: Pair[];
  poolPlayGameAmount: number;
  courtsAvailable: number;

  roundTeams = [];

  constructor() { }

  ngOnInit(): void {
    this.pairInfo = JSON.parse(localStorage.getItem('pairInfo'));
    this.poolPlayGameAmount = parseInt(localStorage.getItem('poolPlayGameAmount'));
    this.courtsAvailable = parseInt(localStorage.getItem('courtsAvailable'));

    this.createRounds();
    this.createTeams();
    console.log(this.roundTeams);
  }

  createRounds = () => {
    for(let i = 0; i < this.poolPlayGameAmount; i++) {
      this.roundTeams.push([]);
    }
  }

  createTeams = () => {
    let shuffledPairs: Pair[] = _.clone(this.shuffle(this.pairInfo));
    let i = 1;

    // make it so pairs don't pair up with the same pair in pool play using pairHistory
    this.roundTeams.forEach(round => {
      while(shuffledPairs.length > 0) {
        let pair1 = shuffledPairs.pop();
        let pair2 = shuffledPairs.pop();

        let p1 = this.pairInfo.find(e => e.teamNumber == pair1.teamNumber);
        if(!p1.pairHistory) p1.pairHistory = [];
        p1.pairHistory.push(pair2);

        let p2 = this.pairInfo.find(e => e.teamNumber == pair2.teamNumber);
        if(!p2.pairHistory) p2.pairHistory = [];
        p2.pairHistory.push(pair1);

        round.push({ teamId: i, pair1: pair1, pair2: pair2 });
        i++;
      }

      shuffledPairs = this.shuffle(this.pairInfo);
    });
  }

  shuffle = (array) => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

}
