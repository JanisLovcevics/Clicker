let points = 0
let seq_len = 2


const buttons = document.getElementsByClassName("click-btn")

const ActivateButton = (index) => {
    buttons[index].classList.add("active-btn")
    setTimeout(() => {
        buttons[index].classList.remove("active-btn")
    }, 1000);
}

const GenerateSequence = () => {
    var sequence = [];
    while (sequence.length < seq_len) {
        n = Math.floor(Math.random() * 4)
        sequence.push(n)
    }
    return sequence;
}

const ResetButtons = () => {
    for (var btn of buttons) {
        btn.classList.remove("active-btn")
    }
}

const ShowSequence = () => {
    var btn_sequence = GenerateSequence();
    for (let i = 0; i < btn_sequence.length; i++) {
        setTimeout(() => {
            ActivateButton(btn_sequence[i])
        }, 1000 * (i + 1))
        console.log("timeout")
    }
    console.log("active")
}

function Game() {
    ShowSequence()
}

Game()