let level = 1;
let seq_len = 1;
let score = 0;

let adding_score = 1;

let user_sequence = [];
let game_sequence = [];
let user_turn = false;
let game_on = false
let mini_game_on = false
let mini_game_chance = 0
let mini_games_chances = [
    {run : (index) => {
        CatchNumber(index)
    }, chance : 0},
    {run : (index) => {
        Pacman(index)
    }, chance : 0}
]



let buttons_Listeners = []

const level_improvements = {
    3: () => {
        catch_num_btn = new_games_adding_btns[0]
        catch_num_btn.style.display = "block"
        catch_num_btn.addEventListener("click", () => {
            mini_games_chances[0].chance = 30
            seq_len = 2
            catch_num_btn.style.display = "none"
        })
    },
    5: () => {
        pacman_btn = new_games_adding_btns[1]
        pacman_btn.style.display = "block"
        pacman_btn.addEventListener("click", () => {
            mini_games_chances[1].chance = 10
            seq_len = 2
            pacman_btn.style.display = "none"
        })
    }
}

let buttons_statuses = [true, true, true, true]

const new_games_adding_btns = document.querySelector(".improvements").children
const buttons = document.getElementsByClassName("click-btn");
const btns_bg = document.querySelector(".btns-bg")
const victory_div = document.getElementById("victory-div")
const score_div = document.getElementById("score-div")
const start_btn = document.getElementById("start-btn")


const AddEventToButtons = (_buttons) => {
    for (let i = 0; i < _buttons.length; i++) {
        const clickHandler = () => {
            HandleUserClick(i);
        }
    
        buttons_Listeners[i] = clickHandler
        
        _buttons[i].addEventListener("click", clickHandler)
    }
}

AddEventToButtons(buttons)

const RemoveEventFromButtons = (_buttons) => {
    for (let i = 0; i < _buttons.length; i++) {
        _buttons[i].removeEventListener("click", buttons_Listeners[i])
    }
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
    score_div.innerText = `Your score is ${level}`
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

const FastClickButton = (index) => {
    buttons[index].classList.add("fast-clicked-btn");
}


const DeactivateButton = (index) => {
    buttons[index].classList.remove("active-btn");
    buttons[index].classList.remove("clicked-btn")
    buttons[index].classList.remove("fast-clicked-btn")
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


const HideButtonsExcept = (_buttons, index) => {
    user_turn = false
    const btn = _buttons[index];

    const btnRect = btn.getBoundingClientRect();
    const parentRect = btns_bg.getBoundingClientRect();

    const startTop = btnRect.top - parentRect.top;
    const startLeft = btnRect.left - parentRect.left;

    btn.style.position = 'absolute';
    btn.style.top = startTop + 'px';
    btn.style.left = startLeft + 'px';
    btn.style.width = btnRect.width + 'px';
    btn.style.height = btnRect.height + 'px';

    for (let i = 0; i < _buttons.length; i++) {
        if (i != index) {
            _buttons[i].classList.add("btn-hide");
            setTimeout(() => {
                _buttons[i].style.display = "none";
            }, 200);
        }
    }

    void btn.offsetWidth; 

    btn.classList.remove("btn-pointer")
    btn.classList.add("btn-stretch");
}


const CatchNumber = (index) => {
    const ClickButtonInCatchNumber = async () => {
        FastClickButton(index);
        setTimeout(() => {
            DeactivateButton(index);
        }, 50);

        answer--;
        number_display.innerText = answer

        if (answer <= 0) {
            StopMiniGame(index)
            number_display.remove()
            buttons[index].removeEventListener("mousedown", ClickButtonInCatchNumber)
        }
    }

    buttons[index].addEventListener("mousedown", ClickButtonInCatchNumber)
    HideButtonsExcept(buttons, index)
    const parentBtn = buttons[index]
    const number_display = document.createElement("div")
    number_display.classList.add("number-display")

    let answer = Math.floor(Math.random() * (10 - 1) + 1)
    number_display.innerText = answer
    parentBtn.prepend(number_display)
}


const TryToStartMiniGame = (chance, index) => {
    if (chance === 0) {
        return
    }

    let roll = Math.random() * 100
    if (roll <= chance) {
        max_chance = mini_games_chances.reduce((sum, mini_game) => sum + mini_game.chance, 0)
        random_chance = Math.random() * max_chance
        for (let mini_game of mini_games_chances) {
            if (random_chance < mini_game.chance) {
                mini_game.run(index)
                mini_game_on = true
                return
            }
            random_chance -= mini_game.chance
        }
        
    }
}


const Directions = Object.freeze({
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT",
    NONE: "NONE"
})


let pacman_direction = Directions.NONE


const pacmanGrid = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 1, 1, 0, 0, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];


let pacman_coords = [1, 1]
let prev_pacman_coords = []
let target_coords = []


const GeneratePossibleTargetCoords = () => {
    let _possible_target_coords = []
    for ( let i = 0; i < pacmanGrid.length; i++) {
        for ( let j = 0; j < pacmanGrid[i].length; j++) {
            if (pacmanGrid[i][j] == 0) {
                _possible_target_coords.push([j, i])
            }
        }
    }

    return _possible_target_coords
}


let possible_coords = GeneratePossibleTargetCoords()


const GeneratePacmanTarget = (_pacman_bg) => {
    target_coords = possible_coords[Math.floor(Math.random() * possible_coords.length)]
    _pacman_bg.children[(target_coords[1]) * 10 + (target_coords[0])].style.backgroundColor = "red"
}


const CreateRectangle = (color) => {
    const rect = document.createElement("div")
    if (color != null){
        rect.style.backgroundColor = color
    }
    return rect
}


const StopMiniGame = async (index) => {
    checkRoundWin()

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.opacity = "0"
    }

    await delay(500)

    buttons[index].style.position = "";
    buttons[index].style.top = "";
    buttons[index].style.left = "";
    buttons[index].style.width = "";
    buttons[index].style.height = "";

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].style.display = ""
    }

    void btns_bg.offsetWidth

    for (let i = 0; i < buttons.length; i++) {
        if (i !== index) {
            buttons[i].classList.remove("btn-hide");
        } else {
            buttons[i].classList.remove("btn-stretch");
        }
        buttons[i].classList.add("btn-pointer");
        buttons[i].style.opacity = ""
    }

    await delay(200)

    user_turn = true
}


const StopPacman = async (index, _pacman_bg) => {
    StopMiniGame(index)
    _pacman_bg.remove()
}


const Pacman = async (index) => {
    HideButtonsExcept(buttons, index)
    const parentBtn = buttons[index]
    const pacman_bg = document.createElement("div")
    pacman_bg.classList.add("pacman-bg")

    while (true) {
        pacman_coords = possible_coords[Math.floor(Math.random() * possible_coords.length)]
        if (pacman_coords[0] != target_coords[0] || pacman_coords[1] != target_coords[1]) {
            break
        }
    }
    

    pacmanGrid.forEach((row) => {
        row.forEach((cell) => {
            let value;
            if (cell == 1) {
                value = CreateRectangle("blue")
            }
            else {
                value = CreateRectangle()
            }
            pacman_bg.append(value)
        })
    })

    parentBtn.prepend(pacman_bg)
    DrawPacman(pacman_bg)
    GeneratePacmanTarget(pacman_bg)

    document.addEventListener('keydown', (event) => {
        switch (event.code){
            case ("KeyW"):
                pacman_direction = Directions.UP
                break
            case ("KeyS"):
                pacman_direction = Directions.DOWN
                break
            case ("KeyA"):
                pacman_direction = Directions.LEFT
                break
            case ("KeyD"):
                pacman_direction = Directions.RIGHT
                break
            default:
                pacman_direction = Directions.NONE
                break
        }
    })

    DrawPacman(pacman_bg)

    const pacman_movement = setInterval(() => {
        MovePacman()
        DrawPacman(pacman_bg)
        if (pacman_coords[0] == target_coords[0] && pacman_coords[1] == target_coords[1]) {
            clearInterval(pacman_movement)
            StopPacman(index, pacman_bg)
        }
    }, 300)
}


const MovePacman = () => {
    prev_pacman_coords = [...pacman_coords]
    next_pacman_coords = [...pacman_coords]
    switch (pacman_direction){
        case (Directions.UP) :
            next_pacman_coords[1] -= 1
            break
        case (Directions.DOWN):
            next_pacman_coords[1] += 1
            break
        case (Directions.LEFT):
            next_pacman_coords[0] -= 1
            break
        case (Directions.RIGHT):
            next_pacman_coords[0] += 1
            break
        case (Directions.NONE):
            break
    }
    if (next_pacman_coords[0] > 9 || next_pacman_coords[1] > 9 || next_pacman_coords[0] < 0 || next_pacman_coords[1] < 0 || pacmanGrid[next_pacman_coords[1]][next_pacman_coords[0]] == 1){
        return
    }
    else {
        pacman_coords = [...next_pacman_coords]
    }
}


const DrawPacman = (_pacman_bg) => {
    if (prev_pacman_coords.length > 0){
        _pacman_bg.children[(prev_pacman_coords[1]) * 10 + (prev_pacman_coords[0])].style.backgroundColor = "black"
    }
    const rects = _pacman_bg.children[(pacman_coords[1]) * 10 + (pacman_coords[0])]
    rects.style.backgroundColor = "yellow"
    rects.classList.add("pacman")
}


const DoPostRoundActivities = () => {
    SetButtonsBackground(user_turn)
    DisableButtons()
    if (level in level_improvements) {
        level_improvements[level]()
        mini_game_chance = 30
    }
    game_on = false
}


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


const checkRoundWin = () => {
    const current_step = user_sequence.length - 1;
    
    if (user_sequence[current_step] != game_sequence[current_step]){
        user_turn = false
        ShowVictory(false)
        HideScore()
        seq_len = 1
        level = 1;
        DoPostRoundActivities()
        return;
    }

    if (user_sequence.length === game_sequence.length){
        user_turn = false;
        ShowVictory(true)
        ShowScore()
        seq_len++
        level++;
        score += adding_score;
        DoPostRoundActivities()
        return;
    }
}


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

    TryToStartMiniGame(mini_game_chance, index)
    
    start_btn.innerText = "Next"

    user_sequence.push(index);
    if (!mini_game_on) {
        checkRoundWin()
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