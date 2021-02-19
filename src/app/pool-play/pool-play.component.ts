import { Team } from './../classes/team';
import { Pair } from './../classes/pair';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { Router } from '@angular/router';

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
  courtGames = {};

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.pairInfo = JSON.parse(localStorage.getItem('pairInfo'));
    this.poolPlayGameAmount = parseInt(localStorage.getItem('poolPlayGameAmount'));
    this.courtsAvailable = parseInt(localStorage.getItem('courtsAvailable'));
    
    let courtData = localStorage.getItem("courtGames");
    if(!courtData) {
      this.createRounds();
      this.createTeams();
      this.createCourts();
      this.assignCourts();
      console.log("courtGames: ", this.courtGames);
      localStorage.setItem("courtGames", JSON.stringify(this.courtGames));
    }
    else {
      this.courtGames = JSON.parse(courtData);
      console.log("courtGames: ", this.courtGames);
    }
  }

  inputChange(event) {
    localStorage.setItem("courtGames", JSON.stringify(this.courtGames));
  }

  createCourts = () => {
    for(let i = 0; i < this.courtsAvailable; i++) {
      let courtName = `court${i+1}`;
      this.courtGames[courtName] = [];
    }
  }

  // Refactor idea: from the start, build an array of pairs in each round. pick off from the teams that aren't in that array
  assignCourts = () => {
    this.roundTeams.forEach((teams: Team[], i: number) => {
      debugger;
      let courtNumber = 1;
      while(teams.length > 0) {
        if(teams.length >= 2) {
          let team1 = teams.pop();
          let team2 = teams.pop();

          if(courtNumber == this.courtsAvailable) {
            courtNumber = 1;
          }

          let courtName = `court${courtNumber}`;
          this.courtGames[courtName].push({ team1: team1, team2: team2 });
          courtNumber++;
        }
        else {
          let carryOverTeam = teams.pop();
          this.roundTeams[i+1].push(carryOverTeam);
        }
      }
    });

    if(this.courtMalfunction()) {
      this.reset();
    }
  }

  createRounds = () => {
    for(let i = 0; i < this.poolPlayGameAmount; i++) {
      this.roundTeams.push([]);
    }
  }

  courtMalfunction = () => {
    let i = 0;

    for(const court in this.courtGames) {
      i += this.courtGames[court].length;
    }

    if(i == 0) {
      return true;
    }

    return false;
  }

  matchMalfunction = () => {
    this.roundTeams.forEach(round => {
      if(round.length == 0) {
        return true;
      }
    });

    return false;
  }

  reset = () => {
    this.roundTeams = [];
    this.createRounds();
    this.pairInfo.forEach(pair => {
      pair.pairHistory = [];
    });
    this.createTeams();
    this.assignCourts();
  }

  createTeams = () => {
    let shuffledPairs: Pair[] = _.clone(this.shuffle(this.pairInfo));
    let i = 1;
    let n = 0;

    for(let x = 0; x < this.roundTeams.length; x++) {
      while(shuffledPairs.length > 0) {
        n++;
        if(n > this.pairInfo.length * 10 || this.matchMalfunction()) {
          this.roundTeams = [];
          this.createRounds();
          shuffledPairs = _.clone(_.reverse(this.shuffle(this.pairInfo)));
          i = 1;
          n = 0;

          this.pairInfo.forEach(pair => {
            pair.pairHistory = [];
          });
          break;
        }

        let pair1 = shuffledPairs.pop();
        let pair2 = shuffledPairs.pop();

        let p1 = this.pairInfo.find(e => e.pairNumber == pair1.pairNumber);
        if(!p1.pairHistory) p1.pairHistory = [];
        
        if(this.containsObject(pair2, p1.pairHistory)) {
          shuffledPairs.push(pair1);
          shuffledPairs.push(pair2);
          shuffledPairs = _.clone(this.shuffle(shuffledPairs));
          continue;
        }

        let p2CloneWiped = _.clone(pair2);
        p2CloneWiped.pairHistory = null;

        p1.pairHistory.push(p2CloneWiped);

        let p2 = this.pairInfo.find(e => e.pairNumber == pair2.pairNumber);

        let p1CloneWiped = _.clone(pair1);
        p1CloneWiped.pairHistory = null;
        if(!p2.pairHistory) p2.pairHistory = [];
        p2.pairHistory.push(p1CloneWiped);

        this.roundTeams[x].push({ teamId: i, pair1: pair1, pair2: pair2, score: 0 });
        i++;
      }
      if(n == 0) break;
      shuffledPairs = _.clone(this.shuffle(this.pairInfo));
    };

    if(n == 0 || this.roundTeams[0].length == 0) {
      setTimeout(() => {
        this.createTeams();
      }, 500);
    }
  }

  submitPools = () => {
    if(confirm("Finalize pools?")) {
      for(let court in this.courtGames) {
        this.courtGames[court].forEach(match => {

          const team1Diff = match.team1.score - match.team2.score;

          let t1p1 = _.find(this.pairInfo, (p) => { return p.pairNumber == match.team1.pair1.pairNumber });
          if(t1p1 && !t1p1.pointDifferential) t1p1.pointDifferential = 0;
          t1p1.pointDifferential += team1Diff;

          let t1p2 = _.find(this.pairInfo, (p) => { return p.pairNumber == match.team1.pair2.pairNumber });
          if(t1p2 && !t1p2.pointDifferential) t1p2.pointDifferential = 0;
          t1p2.pointDifferential += team1Diff;

          const team2Diff = match.team2.score - match.team1.score;

          let t2p1 = _.find(this.pairInfo, (p) => { return p.pairNumber == match.team2.pair1.pairNumber });
          if(t2p1 && !t2p1.pointDifferential) t2p1.pointDifferential = 0;
          t2p1.pointDifferential += team2Diff;

          let t2p2 = _.find(this.pairInfo, (p) => { return p.pairNumber == match.team2.pair2.pairNumber });
          if(t2p2 && !t2p2.pointDifferential) t2p2.pointDifferential = 0;
          t2p2.pointDifferential += team2Diff;
        });
      }

      console.log("pairInfo: ", this.pairInfo);
      localStorage.setItem("pairInfo", JSON.stringify(this.pairInfo));

      this.router.navigateByUrl("/tournament");
    }
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

  containsObject = (obj: Pair, list: Pair[]) => {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].pairNumber == obj.pairNumber) {
            return true;
        }
    }

    return false;
}
}
