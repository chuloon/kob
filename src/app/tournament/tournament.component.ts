import { Team } from './../classes/team';
import { Pair } from './../classes/pair';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {
  pairInfo: Pair[];
  courtsAvailable: number;
  tournamentCount: number;
  bracketMatchups;
  bracketPairs;
  brackets = [];
  courtGames = {};

  constructor() { }

  ngOnInit(): void {
    this.getDataFromStorage();
    this.createBrackets();
    this.createTeams();
  }

  getDataFromStorage = () => {
    this.pairInfo = JSON.parse(localStorage.getItem("pairInfo"));
    this.courtsAvailable = JSON.parse(localStorage.getItem("courtsAvailable"));
    this.tournamentCount = JSON.parse(localStorage.getItem("tournamentCount"));
  }

  createBrackets = () => {
    this.bracketMatchups = {};
    this.bracketPairs = {};

    for(let i = 0; i < this.tournamentCount; i++) {
      this.bracketMatchups[`bracket${i}`] = [];
      this.bracketPairs[`bracket${i}`] = [];
    }
  }

  createTeams = () => {
    this.sortTeams();
    this.createBracketTeams();

    this.createBracketMatchups();
    this.assignCourts();
    debugger;
  }

  assignCourts = () => {
    let currentCourt = 1;
    this.createCourts();
    
    for(let bracketMatches in this.bracketMatchups) {
      this.bracketMatchups[bracketMatches].forEach(match => {
        this.courtGames[`court${currentCourt}`].push(match);

        currentCourt++;
        if(currentCourt > this.courtsAvailable) currentCourt = 1;
      });
    }
    console.log("courtGames: ", this.courtGames);
  }

  createCourts = () => {
    for(let i = 0; i < this.courtsAvailable; i++) {
      let courtName = `court${i+1}`;
      this.courtGames[courtName] = [];
    }
  }

  createBracketMatchups = () => {
    this.splitBrackets();
    debugger;
    for(let bracket in this.bracketPairs) {
      while(this.bracketPairs[bracket].length > 0) {
        const team1 = this.bracketPairs[bracket].shift();
        const team2 = this.bracketPairs[bracket].pop();

        this.bracketMatchups[bracket].push({ team1: team1, team2: team2 });
      }
    }
    console.log("bracketMatchups: ", this.bracketMatchups);
  }

  createBracketTeams = () => {
    let i: number = 0;
    let pairInfoClone = _.clone(this.pairInfo);
    debugger;
    while(pairInfoClone.length > 0) {
      let pair1 = pairInfoClone.shift();
      let pair2 = pairInfoClone.pop();

      const team: Team = { pair1: pair1, pair2: pair2, score: 0, teamId: i };
      this.brackets.push(team);
      i++;
    }
    console.log("brackets:", this.brackets);
  }

  splitBrackets = () => {
    if(this.tournamentCount > 1) {
      const teamsPerBracket = Math.floor(this.brackets.length / this.tournamentCount);
      let bracketTeamsClone = _.clone(this.brackets);
      for(let bracket in this.bracketMatchups) {
        let tempArray = [];
        for(let i = 0; i < teamsPerBracket; i++) {
          tempArray.push(bracketTeamsClone.shift());
        }

        this.bracketPairs[bracket] = this.bracketPairs[bracket].concat(tempArray);
      }
    }
    else {
      this.bracketPairs['bracket0'] = _.clone(this.brackets);
    }
  }

  sortTeams = () => {
    this.pairInfo = _.orderBy(this.pairInfo, [(o) => {
      return o.pointDifferential
    }], ['desc']);
  }
}
