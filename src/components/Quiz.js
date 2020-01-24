import React, { Component } from "react";
import QuizOptions from "./QuizOptions";

class Quiz extends Component {
  constructor(props) {
    super(props);
    this.renderOptions = this.renderOptions.bind(this);
    this.checkResults = this.checkResults.bind(this);
    this.playAgain = this.playAgain.bind(this);

    let riddle = this.playGame();
    let correct = false;
    let gameOver = false;
    let highScore = localStorage.getItem("high-score") || 0;
    this.state = { riddle, correct, gameOver, score: 0, highScore };
  }
  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  generateRandomOptions(sum) {
    // let result = sum;
    let resultsArray = [];
    let randomNumberArray = [];

    while (randomNumberArray.length <= 3) {
      let randomNumber = this.randomNumber(1, 19);
      if (randomNumberArray.indexOf(randomNumber) > -1) continue;
      randomNumberArray.push(randomNumber);
    }
    for (let i = 0; i < 3; i++) {
      let addSubtract = this.randomNumber(0, 1);
      let result = sum;
      if (addSubtract === 1) {
        //add the number to the result
        result += randomNumberArray[i];
        resultsArray.push(result);
      } else {
        //subtract the number from the result
        result -= randomNumberArray[i];
        resultsArray.push(result);
      }
    }

    return resultsArray;
  }
  playGame(difficulty = 0) {
    let a = 20 + (10 + difficulty) * difficulty;
    let b = 40 + (10 + difficulty) * difficulty;
    let field1 = this.randomNumber(a, b);
    let field2 = this.randomNumber(a, 10 + b);
    let result = field1 + field2;
    let resultsArray = this.generateRandomOptions(result);
    resultsArray.push(result);
    resultsArray.sort(function (a, b) {
      return 0.5 - Math.random();
    });

    let riddle = {
      resultsArray: resultsArray,
      field1: field1,
      field2: field2,
      answer: result
    };
    if (this.state && this.state.gameOver) {
      this.setState({ riddle: riddle });
    } else {
      return riddle;
    }

  }
  checkResults(option) {
    if (this.state.riddle.answer === option) {
      this.setState({ correct: true, gameOver: true });
    } else {
      this.setState({ correct: false, gameOver: true });
    }
  }
  renderOptions() {
    return (
      <div className='options'>
        {this.state.riddle.resultsArray.map((option, i) => (
          <QuizOptions
            option={option}
            key={i}
            checkResults={option => this.checkResults(option)}
          />
        ))}
      </div>
    );
  }
  renderMessage() {
    if (this.state.correct) {
      return <h3>Good job, Hit the button below to play the game again!</h3>;
    } else {
      return <h3> Ooopps!, Hit the button below to play the game again!</h3>;
    }
  }
  playAgain() {
    if (this.state.correct) {
      this.state.score++;
      if (this.state.score > this.state.highScore) {
        this.state.highScore = this.state.score;
        localStorage.setItem("high-score", this.state.highScore);
      }
    } else {
      this.state.score = 0;
    }
    this.setState({ correct: false, gameOver: false, score: this.state.score });
    this.playGame(this.state.score);
  }
  render() {
    return (
      <div className='quiz'>
        <div className='quiz-content'>
          <p className='question'>
            What is the sum of{" "}
            <span className='text-info'>{this.state.riddle.field1}</span> and{" "}
            <span className='text-info'>{this.state.riddle.field2}</span> ?{" "}
          </p>
          <span>Score: {this.state.score}, High score: {this.state.highScore}</span>
          {this.renderOptions()}
          <div className={`after ${this.state.correct ? 'correct animated zoomInUp' : 'wrong animated zoomInDown'} ${!this.state.gameOver ? 'hide' : ""}`}>{this.renderMessage()}</div>
          <div className='play-again'>
            <a className='button' onClick={this.playAgain}>
              {this.state.correct ? "Continue" : "Play Again"}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Quiz;
