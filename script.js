let points = 0;
let seq_len = 2;

let user_sequence = [];
let game_sequence = [];
let user_turn = false;

const buttons = document.getElementsByClassName("click-btn");

// ИСПРАВЛЕНИЕ 1: Используем let вместо var для сохранения контекста индекса
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
        // ИСПРАВЛЕНИЕ 2: Вызываем функцию и передаем индекс нажатой кнопки
        HandleUserClick(i);
    });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

const ActivateButton = (index) => {
    buttons[index].classList.add("active-btn");
};

const DeactivateButton = (index) => {
    buttons[index].classList.remove("active-btn");
};

const GenerateSequence = () => {
    let sequence = []; // Лучше использовать let вместо var
    while (sequence.length < seq_len) {
        let n = Math.floor(Math.random() * 4); // ИСПРАВЛЕНИЕ 3: Добавили let для локальной области видимости
        sequence.push(n);
    }
    return sequence;
};

const ShowSequence = async () => {
    game_sequence = GenerateSequence();
    for (let i = 0; i < game_sequence.length; i++) {
        ActivateButton(game_sequence[i]);
        await delay(500);
        DeactivateButton(game_sequence[i]);
        await delay(500);
    }
    user_sequence = []
    user_turn = true;
};

const HandleUserClick = (index) => {
    if (!user_turn) {
        return;
    }

    ActivateButton(index);
    setTimeout(() => {
       DeactivateButton(index); 
    }, 200);

    user_sequence.push(index);

    const current_step = user_sequence.length - 1;

    // Проверка на ошибку
    if (user_sequence[current_step] != game_sequence[current_step]){
        console.warn("Dumbass");
        // Здесь можно добавить сброс игры или уменьшение жизней
        return;
    }

    // Проверка на победу в раунде
    if (user_sequence.length === game_sequence.length){
        user_turn = false;
        console.log("win");
        ShowVictory()
        return;
    }
};

const ShowVictory = () => {
    const win_p = document.createElement("div")
    win_p.textContent = "You Win!"
    document.getElementById("layout").prepend(win_p)
}

document.getElementById("start-btn").addEventListener("click", () => {
    ShowSequence()
})