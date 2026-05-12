let points = 0;
let seq_len = 2;

let user_sequence = [];
let game_sequence = [];
let user_turn = false;

const buttons = document.getElementsByClassName("click-btn");
const btns_bg = document.querySelector(".btns-bg")

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
    for (let i = 0; i < game_sequence.length; i++) {
        ActivateButton(game_sequence[i]);
        await delay(500);
        DeactivateButton(game_sequence[i]);
        await delay(500);
    }
    user_sequence = []
    user_turn = true;
    SetButtonsBackground(user_turn)
};

const HandleUserClick = (index) => {
    if (!user_turn) {
        return;
    }

    ClickButton(index);
    setTimeout(() => {
       DeactivateButton(index);
    }, 500);

    user_sequence.push(index);

    const current_step = user_sequence.length - 1;

    if (user_sequence[current_step] != game_sequence[current_step]){
        console.warn("Dumbass");
        seq_len = 2
        return;
    }

    // Проверка на победу в раунде
    if (user_sequence.length === game_sequence.length){
        user_turn = false;
        ShowVictory()
        seq_len++
        return;
    }
};

const ShowVictory = () => {
    const win_p = document.createElement("div")
    win_p.textContent = "You Win!"
    win_p.classList.add("win_p")
    document.getElementById("layout").prepend(win_p)
}

document.getElementById("start-btn").addEventListener("click", () => {
    ShowSequence()
})