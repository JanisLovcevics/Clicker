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
    }, chance : 0},
    {run : (index) => {
        ShooterGame(index)
    }, chance : 0}
]



let buttons_Listeners = []

const level_improvements = {
    3: () => {
        const catch_num_btn = new_games_adding_btns[0]
        catch_num_btn.style.display = "block"
        catch_num_btn.addEventListener("click", () => {
            mini_games_chances[0].chance = 30
            seq_len = 2
            catch_num_btn.style.display = "none"
        })
    },
    5: () => {
        const pacman_btn = new_games_adding_btns[1]
        pacman_btn.style.display = "block"
        pacman_btn.addEventListener("click", () => {
            mini_games_chances[1].chance = 10
            seq_len = 2
            pacman_btn.style.display = "none"
        })
    },
    7: () => {
        const shooter_btn = new_games_adding_btns[2]
        shooter_btn.style.display = "block"
        shooter_btn.addEventListener("click", () => {
            mini_games_chances[2].chance = 20
            seq_len = 2
            shooter_btn.style.display = "none"
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
    mini_game_on = false

    if (round_win) {
        DoPostWinActivities()
        round_win = false
    }

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
        if(user_sequence.length < game_sequence.length){
            buttons[i].classList.add("btn-pointer");
        }
        buttons[i].style.opacity = ""
    }

    await delay(200)

    if (user_sequence.length < game_sequence.length){
        user_turn = true
    }
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
    GeneratePacmanTarget(pacman_bg)

    document.addEventListener('keydown', (event) => {
        switch (event.code){
            case ("KeyW"):
                if (CheckIfPacmanCanMove(CountNextPacmanCoords(Directions.UP))){
                    pacman_direction = Directions.UP
                }
                break
            case ("KeyS"):
                if (CheckIfPacmanCanMove(CountNextPacmanCoords(Directions.DOWN))){
                    pacman_direction = Directions.DOWN
                }
                break
            case ("KeyA"):
                if (CheckIfPacmanCanMove(CountNextPacmanCoords(Directions.LEFT))){
                    pacman_direction = Directions.LEFT
                }
                break
            case ("KeyD"):
                if (CheckIfPacmanCanMove(CountNextPacmanCoords(Directions.RIGHT))){
                    pacman_direction = Directions.RIGHT
                }
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


const CheckIfPacmanCanMove = (coords) => {
    if (coords[0] > 9 || coords[1] > 9 || coords[0] < 0 || coords[1] < 0 || pacmanGrid[coords[1]][coords[0]] == 1){
        return false
    }
    return true
}


const CountNextPacmanCoords = (direction) => {
    let next_coords = [...pacman_coords]
    switch (direction){
        case (Directions.UP) :
            next_coords[1] -= 1
            break
        case (Directions.DOWN):
            next_coords[1] += 1
            break
        case (Directions.LEFT):
            next_coords[0] -= 1
            break
        case (Directions.RIGHT):
            next_coords[0] += 1
            break
    }
    return next_coords
}


const MovePacman = () => {
    prev_pacman_coords = [...pacman_coords]
    next_pacman_coords = CountNextPacmanCoords(pacman_direction)
    if (!CheckIfPacmanCanMove(next_pacman_coords)){
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


/*const ShooterGame = (index) => {
    HideButtonsExcept(buttons, index)
    const parentBtn = buttons[index]

    const shooter_bg = document.createElement("div")
    shooter_bg.style = "width: 100% ; height : 100% ; background-color: gray ; border-radius: 40px"
    parentBtn.append(shooter_bg)

    const btnRect = shooter_bg.getBoundingClientRect();
    const parentRect = parentBtn.getBoundingClientRect();

    maxX = btnRect.width - 50
    maxY = btnRect.height - 50

    target_count = Math.floor(Math.random() * 10) + 1

    for (let i = 0; i < target_count; i++) {
        const target = document.createElement("div")
        target.classList.add("shooter-target")
        target.style.left = (Math.random() * (50 + maxX) + 50) + "px"
        target.style.top = (Math.random() * (50 + maxY) + 50) + "px"
        shooter_bg.append(target)
        target.addEventListener("mousedown", () => {
            target_count -= 1
            target.remove()
            if (target_count <= 0) {
                shooter_bg.remove()
                StopMiniGame(index)
            }
        })
    }
}*/

// script.js

const ShooterGame = (index) => {
    HideButtonsExcept(buttons, index)
    const parentBtn = buttons[index]

    const shooter_bg = document.createElement("div")
    shooter_bg.style = "width: 100%; height: 100%; border-radius: 40px; position: relative;"
    parentBtn.append(shooter_bg)

    const targetSize = 100;
    
    const finalWidth = btns_bg.offsetWidth;
    const finalHeight = btns_bg.offsetHeight;

    let target_count = Math.floor(Math.random() * 5) + 3;
    const positions = [];

    for (let i = 0; i < target_count; i++) {
        const target = document.createElement("div")
        target.classList.add("shooter-target")

        let randX, randY, absX, absY;
        let isOverlapping;
        let attempts = 0;

        do {
            isOverlapping = false;
            randX = Math.random();
            randY = Math.random();

            absX = randX * (finalWidth - targetSize);
            absY = randY * (finalHeight - targetSize);

            for (let pos of positions) {
                const dx = absX - pos.x;
                const dy = absY - pos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < targetSize) {
                    isOverlapping = true;
                    break;
                }
            }
            attempts++;
        } while (isOverlapping && attempts < 50);

        positions.push({ x: absX, y: absY });

        target.style.left = `calc(${randX * 100}% - ${randX * targetSize}px)`
        target.style.top = `calc(${randY * 100}% - ${randY * targetSize}px)`

        shooter_bg.append(target)
        
        target.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            target_count -= 1
            target.remove()
            if (target_count <= 0) {
                shooter_bg.remove()
                StopMiniGame(index)
            }
        })
    }
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


const DoPostLossActivities = () => {
    user_turn = false
    ShowVictory(false)
    HideScore()
    seq_len = 1
    level = 1;
    DoPostRoundActivities()
    return;
}


const DoPostWinActivities = () => {
    user_turn = false;
    ShowVictory(true)
    ShowScore()
    seq_len++
    level++;
    score += adding_score;
    DoPostRoundActivities()
    return;
}


let round_win = false;

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
    
    start_btn.innerText = "Next"

    user_sequence.push(index);

    const current_input = user_sequence.length - 1;


    if (user_sequence[current_input] != game_sequence[current_input]){
        DoPostLossActivities()
        return
    }

    TryToStartMiniGame(mini_game_chance, index)

    if (user_sequence.length === game_sequence.length){
        if (!mini_game_on){
            DoPostWinActivities()
        }
        else {
            round_win = true
        }
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