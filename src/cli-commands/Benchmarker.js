const chalk = require("chalk");

class Benchmarker {
  constructor() {
    this.depth = 0;
    this.branches = [];
    // this.branches = [{ name, timeSteps: [], currentStep: 0 }];
  }

  start(name) {
    const newBranch = {
      name,
      timeSteps: [],
      currentStep: 0,
      depth: this.depth++,
    };
    newBranch.timeSteps.push(Date.now());
    this.branches.push(newBranch);

    console.log(
      chalk`${"".padStart(newBranch.depth * 2)}{magenta.bold ${
        newBranch.name
      }}${newBranch.depth ? "" : " Benchmarking"} Started!`
    );
  }

  addStep(stepName) {
    const { branches, depth } = this;

    let lastBranch = branches[depth - 1];
    lastBranch.timeSteps.push(Date.now());
    lastBranch.currentStep++;

    const time =
      (lastBranch.timeSteps[lastBranch.currentStep] -
        lastBranch.timeSteps[lastBranch.currentStep - 1]) /
      1000;
    const timeColor = this._timeColor(time);

    console.log(
      chalk`${"".padStart(lastBranch.depth * 2 + 2)}{italic Step #${
        lastBranch.currentStep
      }:} {blue.bold ${stepName}}: {${timeColor}.bold ${time}} Seconds.`.padStart(
        lastBranch.depth * 2,
        " "
      )
    );
  }

  end() {
    const { branches } = this;

    this.depth--;

    let lastBranch = branches.pop();
    const totalTime =
      (Date.now() - lastBranch.timeSteps[0]) /
      1000;
    const timeColor = this._timeColor(totalTime);

    console.log(
      chalk`${"".padStart(lastBranch.depth * 2)}{magenta.bold ${
        lastBranch.name
      }}${
        lastBranch.depth ? "" : " Benchmarking"
      } Completed. Total Time: {${timeColor}.bgGrey.bold  ${totalTime} } Seconds`
    );
  }

  _timeColor(time) {
    // time <= 0.4s ==> Good
    // 0.4s < time <= 1s ==> Medium
    // 1s < time ==> Bad

    const interpret = time <= 0.4 ? "Good" : time <= 1 ? "Medium" : "Bad";
    return {
      Good: "green",
      Medium: "yellow",
      Bad: "red",
    }[interpret];
  }
}

module.exports = Benchmarker;
