const operators = [ '', 'Addition', 'Subtraction', 'Multiplication', 'Division'];

const operatorButtons = document.querySelectorAll(".calculate-button");
const promptText = document.getElementById("prompt");
const operatorUsed = document.getElementById("operator");
const pageA = document.getElementById('pageA');
const pageB = document.getElementById('pageB');
const pageC = document.getElementById('pageC');
const pageD = document.getElementById('pageD');
const form = document.getElementById('form');
const submitButton = form.querySelector('button');
const input = document.getElementById('answer-input');
const warning = document.querySelector('.warning');
const question = document.getElementById('question');
const summaryHeader = document.getElementById('summary-header');
const scoreDisplay = document.getElementById('score');
const quitGameButton = document.getElementById('quit');
const cancelGameButton = document.getElementById('cancel');
const returnHomeA = document.getElementById('returnA');
const returnHomeB = document.getElementById('returnB');
const viewButton = document.querySelector('.view');
const alertContentContainer = document.querySelector('.alert-content-container');
const yes = document.getElementById('yes');
const no = document.getElementById('no');
const alertBackgroundClick = document.querySelector('.alert-container-background');


quitGameButton.addEventListener("click", () => {
    alertContentContainer.style.display = "flex";
});

cancelGameButton.addEventListener("click", () => {
    location.reload();
});

returnHomeA.addEventListener("click", () => {
        location.reload();
    });

returnHomeB.addEventListener("click", () => {
        location.reload();
    });

yes.addEventListener("click", () => {
    location.reload();
});

no.addEventListener("click", () => {
    alertContentContainer.style.display = "none";
});

alertBackgroundClick.addEventListener("click", () => {
    alertContentContainer.style.display = "none";
});

input.addEventListener("input", (e) => {
    warning.textContent = '';
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9]/g, '');
    e.target.value = inputValue;
});

operatorButtons.forEach((operatorButton) => {
    operatorButton.addEventListener("click", async (e) => {
        e.preventDefault();
        const operator = operatorButton.getAttribute("data-operator");
        const finalData = [];
        
        pageA.style.display = "none";
        pageB.style.display = "block";
        
        let randomIndex;
        
        if (operator === "Random") {
            promptText.textContent = '';
            operatorUsed.textContent = 'Randomizing Operator...';
            randomIndex = await numberRandomizer(operators.length - 1);
            if (randomIndex === 0) {
                randomIndex = await numberRandomizer(operators.length - 1);
            } else {
                operatorUsed.innerHTML = `${operators[randomIndex]}`;
            }
            
        } else {
            promptText.textContent = '';
            operatorUsed.innerHTML = `${operator}`;
        }
        
        const proceedButton = pageB.querySelector('.proceed');
        
        proceedButton.addEventListener("click", async (e) => {
            e.preventDefault();
            pageB.style.display = "none";
            pageC.style.display = "block";
            promptText.textContent = 'One Moment Please...';
            const questions = await generateTenProblems(randomIndex, operator);
            form.style.display = "flex";
            input.focus();
            finalData.push(questions);
            
            
            const formHeader = document.getElementById('form-header');
            formHeader.textContent = `${operator}`;

            const userInputsArray = [];
            const scoreArray = [];

            let questionCount = 0;

            if(operator === "Division" || (operator === "Random" && questions[0][3] == "÷")) {
                question.textContent = `${questions[0][0]} ${questions[0][3]} ${questions[0][1]} =`;
                input.style.textAlign = `center`;
                
            } else {
                question.innerHTML = `
                <div class="lateral-format">
                    <span></span>
                    <span>
                        ${questions[0][0]}
                    </span>
                    <span class="lower-row">
                        ${questions[0][3]}
                    </span>
                    <span class="lower-row">
                        ${questions[0][1]}
                    </span>
                </div>`;
            }


            // Move the event listener outside the loop
            submitButton.addEventListener("click", (e) => {
                e.preventDefault();
                warning.textContent = "";
                input.focus();
            
                if (questionCount < 10) {
                    const currentQuestion = questions[questionCount];
                                    
                    let inputValue = input.value;
                    if(inputValue == '') {
                        warning.textContent = "Uh oh! Please enter your answer.";
                        return;
                    }

                    userInputsArray.push(inputValue);
                
                    const checkAnswer = answerChecker(currentQuestion[2], inputValue);
                    scoreArray.push(checkAnswer);
                    
                    questionCount++;
                    
                    clearInputField();
                    if (questionCount <= 9) {
                        if(operator === "Division" || (operator === "Random" && questions[0][3] == "÷")) {
                            question.textContent = `${questions[questionCount][0]} ${questions[questionCount][3]} ${questions[questionCount][1]} =`;
                            input.style.textAlign = `center`;
                        } else {
                            question.innerHTML = `
                                <div class="lateral-format">
                                    <span></span>
                                    <span>
                                        ${questions[questionCount][0]}
                                    </span>
                                    <span class="lower-row">
                                        ${questions[questionCount][3]}
                                    </span>
                                    <span class="lower-row">
                                        ${questions[questionCount][1]}
                                    </span>
                                </div>`;
                        }
                    }
                }

                if (questionCount >= 10) {
                    input.style.display = "none";
                    submitButton.style.display = "none";
                    viewButton.style.display = "block";
                    quitGameButton.style.display = "none";
                    returnHomeA.style.display = "block";
                    
                    const score = scoreArray.reduce((count, value) => {
                        if (value === true) {
                        return count + 1;
                        } else {
                        return count;
                        }
                    }, 0);

                    question.textContent = `Total Score: ${score}`;
                    finalData.push(userInputsArray, scoreArray);

                    viewButton.addEventListener("click", (e) => {
                        e.preventDefault();
                        pageC.style.display = 'none';
                        pageD.style.display = 'block';
                        summaryHeader.textContent = `${operator}`;
                        scoreDisplay.textContent = `Total Score: ${score}`;

                        displaySummary(finalData);

                    });
                }

            });

            function clearInputField() {
                input.value = '';
            }
        });     
    });
});

function answerChecker(c, input) {
    if(c == input) 
        return true;
    else return false;
}

async function generateTenProblems(randomIndex, operator) {
    const progressFill = document.querySelector('.progress-fill');
    const questions = [];
    for (let i = 0; i < 10; i++) {
        if (operator === "Random") {
            [a, b, c, sign] = await calculateResult(operators[randomIndex]);
        } else {
            [a, b, c, sign] = await calculateResult(operator);
        }

        const newArray = [a, b, c, sign];
        questions.push(newArray);
        
        const counter = i + 1;
        const nth = ( counter === 1) ? 'st' : ( counter === 2) ? 'nd' : ( counter === 3) ? 'rd' : 'th';

        const progress = ( counter / 10 ) * 100;
        progressFill.style.width = progress + '%';

        promptText.innerHTML = `Generating ${counter}${nth} problem`;
        if(counter === 10) {
            promptText.innerHTML = '';
            const progress = document.querySelector('.progress');
            progress.style.display = 'none';
        
        }
    }
    return questions;
}

function displaySummary(finalData) {
    const questionList = document.getElementById('question-list');
    questionList.innerHTML = '';
    const listItem = document.createElement('li');

    listItem.innerHTML = `
        <span class="cell span-header"><h4>Question</h4></span>
        <span class="cell span-header"><h4>Inputs</h4></span>
        <span class="cell span-header"><h4>Correct</h4></span>
    `;

    for (let i=0; i<=10; i++) {
        
        const listItem = document.createElement('li');
        
        if(i === 0) {
            listItem.innerHTML = `
                <span class="cell span-header"><h4>Number</h4></span>
                <span class="cell span-header"><h4>Problem</h4></span>
                <span class="cell span-header"><h4>Inputs</h4></span>
                <span class="cell span-header"><h4>Correct</h4></span>
            `;
        } else {
            let count = i - 1;
            const prob = finalData[0][count];
            const userAnswer = finalData[1][count];
            const checking = finalData[2][count];

            const [a, b, c, sign] = prob;

            listItem.innerHTML = `
                <span class="cell">${i}</span>
                <span class="cell">${a} ${sign} ${b} = ${c}</span>
                <span class="cell">${userAnswer}</span>
                <span class="cell ${(checking ? 'check' : 'cross')}">${(checking ? '&#x2713;' : 'x')}</span>
            `;
        }
        

        questionList.appendChild(listItem);
    }
}

async function calculateResult(operator) {
    const length = 100;
    const sign = getOperatorSign(operator);

    const tempA = await numberRandomizer(length);
    const tempB = await numberRandomizer(length);
    let a, b, c;

    if (tempA >= tempB) {
        a = tempA;
        b = tempB;
    } else {
        a = tempB;
        b = tempA;
    }


    switch (operator) {
        case "Addition":
            c = a + b;
            break;
        case "Subtraction":
            c = a - b;
            break;
        case "Multiplication":
            return await multiplicationOperation();
        case "Division":
            return await divisionOperation();
        default:
            c = 0;
    }

    return [a, b, c, sign];
}

function getOperatorSign(operator) {
    switch (operator) {
        case "Addition":
        return '+';
        case "Subtraction":
        return '-';
        case "Multiplication":
        return 'x';
        case "Division":
        return '÷';
        default:
        return '';
    }
}

async function multiplicationOperation() {
    const maxProduct = 100;

    const tempA = await numberRandomizer(Math.floor(Math.sqrt(maxProduct)));
    const maxB = Math.floor(maxProduct / tempA);
    const tempB = await numberRandomizer(maxB);
    const sign = 'x';
    let a, b, c;

    if (tempA >= tempB) {
        a = tempA;
        b = tempB;
    } else {
        a = tempB;
        b = tempA;
    }
    
    c = a * b;

    return [a, b, c, sign];
}

async function divisionOperation() {
    const maxNumber = 10;

    const b = await numberRandomizer(maxNumber) + 1;

    const maxDividend = maxNumber * b;

    const a = (await numberRandomizer(maxDividend / b)) * b;

    const sign = '÷';
    const c = a / b;

    return [a, b, c, sign];
}

async function numberRandomizer(length) {
    let randomNumber = Math.floor(Math.random() * length) + 1;
    return new Promise((resolve) => setTimeout(() => resolve(randomNumber), 100));
}
