let level = 1;
let seq_len = 1;
let score = 0;

let user_sequence = [];
let game_sequence = [];
let user_turn = false;
let game_on = false

const level_improvements = {
    5: () => {
        improvements[0].classList.add("impro-act")
    }
}

let buttons_statuses = [true, true, true, true]

const improvements = document.getElementById("improvements").children
const buttons = document.getElementsByClassName("click-btn");
const btns_bg = document.querySelector(".btns-bg")
const victory_div = document.getElementById("victory-div")
const score_div = document.getElementById("score-div")
const start_btn = document.getElementById("start-btn")


for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
        HandleUserClick(i);
    });
}


const SetButtonsBackground = (status) => {
    if (!status) {
        btns_bg.classList.remove("btns-bg-active")
        btns_bg.classList.add("btns-bg-passive")
    }
    else {
        btns_bg.classList.remove("btns-bg-passive")
        btns_bg.classList.add("btns-bg-active")
    }
}


const EnableButtons = () => {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("btn-pointer");
    }
};


const DisableButtons = () => {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("btn-pointer");
    }
};


const ShowScore = () => {
    score_div.innerText = `Your score is ${seq_len}`
}


const HideScore = () => {
    score_div.innerText = ""
}


const delay = ms => new Promise(res => setTimeout(res, ms));


const ActivateButton = (index) => {
    buttons[index].classList.add("active-btn");
};


const ClickButton = (index) => {
    buttons[index].classList.add("clicked-btn");
}


const DeactivateButton = (index) => {
    buttons[index].classList.remove("active-btn");
    buttons[index].classList.remove("clicked-btn")
};


const MakeButtonNotClickableForTime = (index, time) => {
    buttons_statuses[index] = false
    setTimeout(() => {
        buttons_statuses[index] = true
    }, time);
}


const GenerateSequence = () => {
    let sequence = [];
    while (sequence.length < seq_len) {
        let n = Math.floor(Math.random() * 4);
        sequence.push(n);
    }
    return sequence;
};


const ShowSequence = async () => {
    user_turn = false
    SetButtonsBackground(user_turn)
    game_sequence = GenerateSequence();
    await delay(200);
    for (let i = 0; i < game_sequence.length; i++) {
        ActivateButton(game_sequence[i]);
        await delay(500);
        DeactivateButton(game_sequence[i]);
        await delay(500);
    }
    user_sequence = []
    user_turn = true;
    EnableButtons()
    SetButtonsBackground(user_turn)
};


const HandleUserClick = (index) => {
    if (!user_turn) {
        return;
    }
    if (buttons_statuses[index] === false){
        return
    }

    ClickButton(index);
    MakeButtonNotClickableForTime(index, 500)
    setTimeout(() => {
       DeactivateButton(index);
    }, 500);

    user_sequence.push(index);

    const current_step = user_sequence.length - 1;

    start_btn.innerText = "Next"

    game_on = false

    if (user_sequence[current_step] != game_sequence[current_step]){
        user_turn = false
        ShowVictory(false)
        SetButtonsBackground(user_turn)
        HideScore()
        seq_len = 1
        DisableButtons()
        return;
    }

    if (user_sequence.length === game_sequence.length){
        user_turn = false;
        ShowVictory(true)
        SetButtonsBackground(user_turn)
        ShowScore()
        seq_len++
        DisableButtons()
        return;
    }
};


const ShowVictory = (isWin) => {
    if (isWin){
    victory_div.innerText = "You Win"
    }
    else {
        victory_div.innerText = "You Lose"
        start_btn.innerText = "Retry"
    }
}


start_btn.addEventListener("click", () => {
    if (!game_on){
        ShowSequence()
        game_on = true
    }
    else {
        return
    }
})