let word_array = [];
let word_set = new Set();
let guess_word = "";
let current_line_idx = 1;
let current_box_idx = 0;
let current_line;
let current_box;
let duplicates = {};
let temp_duplicates = {};
let color_mode = "dark";
let switchColorBtnHover = null;
let switchColorBtnActiveHover = null;
isAnimating = false;
const styleSheets = document.styleSheets;

function setBoardColor() {
    if (color_mode == "dark") {
        document.body.style.backgroundColor = "#121213";
    } else {
        document.body.style.backgroundColor = "#ffffff";
    };
};

function initializeNewGame() {
    if (!isAnimating) {
        new_game_box = document.getElementsByClassName("newGameMsgBox")[0];
        new_game_box.classList.remove("animateMsgBox");
        void new_game_box.offsetWidth;
        new_game_box.classList.add("animateMsgBox");
    
        if (color_mode == "dark") {
            document.getElementsByClassName("switchColorBtn")[0].textContent = "Blind yourself";
            switchColorBtnHover.backgroundColor = "#ffd900";
            switchColorBtnActiveHover.backgroundColor = "#b69b04";
        } else {
            document.getElementsByClassName("switchColorBtn")[0].textContent = "Be Normal";
            switchColorBtnHover.backgroundColor = "#06af60";
            switchColorBtnActiveHover.backgroundColor = "#036b3b"
        };
    
        for (i=1; i<7; i++) {
            for (j=0; j<5; j++) {
                current_box = document.getElementById(`boxes${i}`).children[j];
                current_box.textContent = "";
                current_box.classList.remove("animateBoxGrowAndShrink", "animateBoxRotate");
                if (color_mode == "dark") {
                    current_box.style.backgroundColor = "#121213";
                    current_box.style.borderColor = "#646164";
                    current_box.color = "#ffffff";
                } else {
                    current_box.style.backgroundColor = "#ffffff";
                    current_box.style.borderColor = "#787c7f";
                    current_box.style.color = "#000000";
                };
            };
        };
    
        current_line_idx = 1;
        current_box_idx = 0;
        current_line = document.getElementById(`boxes${current_line_idx}`);
        current_box = current_line.children[current_box_idx];
    
        for (i=0; i<5; i++) {
            if (color_mode == "dark") {
                current_line.children[i].style.borderColor = "#a5a7a8";
            } else {
                current_line.children[i].style.borderColor = "#3a3a3c";
            };
        };
    
        const randomIndex = Math.floor(Math.random() * word_array.length);
        guess_word = word_array[randomIndex].toUpperCase();
    
        getDuplicates();
        temp_duplicates = {...duplicates};
    
        document.removeEventListener("keydown", handleKeyPress);
        document.addEventListener("keydown", handleKeyPress);
    };
};

async function loadWords() {
    try {    
        const response = await fetch("wordle-words.txt");
        const data = await response.text();
        word_array = data.split(/\s+/);
        word_set = new Set(word_array);
        initializeNewGame();
    }
    catch (err) {
        throw "Word file not found"
    };
};

function rgbToHex(rgb) {
    const match = rgb.match(/\d+/g);
    return match? 
        `#${match.map(x => parseInt(x).toString(16).padStart(2, "0")).join("")}` : rgb;
};

function switchColorModes() {
    const boxes = document.querySelectorAll(".displayBox");

    if (!isAnimating) {
        if (color_mode == "dark") {
            document.getElementsByClassName("switchColorBtn")[0].textContent = "Be Normal";
            switchColorBtnHover.backgroundColor = "#06af60";
            switchColorBtnActiveHover.backgroundColor = "#036b3b"
            document.body.style.backgroundColor = "#ffffff";
            boxes.forEach(box => {
                BgColor = rgbToHex(box.style.backgroundColor);
    
                if (BgColor == "#3a3a3c") {
                    box.style.backgroundColor = "#787c7f";
                    box.style.borderColor = "#787c7f";
                    box.style.color = "#ffffff";
                } else if (BgColor == "#121213") {
                    box.style.borderColor = "#787c7f";
                    box.style.backgroundColor = "#ffffff";
                    box.style.color = "#000000";
                };
            });
            color_mode = "light";
        } else {
            document.getElementsByClassName("switchColorBtn")[0].textContent = "Blind yourself"
            switchColorBtnHover.backgroundColor = "#ffd900";
            switchColorBtnActiveHover.backgroundColor = "#b69b04";
            document.body.style.backgroundColor = "#121213";
            boxes.forEach(box => {
                BgColor = rgbToHex(box.style.backgroundColor);
    
                if (BgColor == "#787c7f") {
                    box.style.backgroundColor = "#3a3a3c";
                    box.style.borderColor = "#3a3a3c";
                    box.style.color = "#ffffff";
                } else if (BgColor == "#ffffff") {
                    box.style.backgroundColor = "#121213";
                    box.style.borderColor = "#646164";
                    box.style.color = "#ffffff";
                }
            });
            color_mode = "dark";
        };
        
        try {
            for (i=0; i<5; i++) {
                if (color_mode == "dark") {
                    current_line.children[i].style.borderColor = "#a5a7a8";
                } else {
                    current_line.children[i].style.borderColor = "#3a3a3c";
                };
            };
        } catch (err) {

        };
    };
};

function getDuplicates() {
    duplicates = {};
    for (let char of guess_word) {
        if (duplicates[char]) {
            duplicates[char]++;
        } else {
            duplicates[char] = 1;
        };
    };
};

function colorBoxes() {
    if (isAnimating === true) {
        return;
    };

    const totalAnimationTime = 1880;
    isAnimating = true;
    let correct_boxes = 0;

    for (let i=0; i < current_line.children.length; i++) {
        let box = current_line.children[i];
        let box_char = box.textContent;
        let current_letter = guess_word.charAt(i);

        setTimeout(() => {
            box.classList.remove("animateBoxRotate");
            void box.offsetWidth;
            box.classList.add("animateBoxRotate");
            void box.offsetWidth;

            setTimeout(() => {
                if (box_char == current_letter) {
                    box.style.backgroundColor = "#528c4f";
                    box.style.borderColor = "#528c4f";
                    box.style.color = "#ffffff";
                    correct_boxes++;
                    
                    if (temp_duplicates[box_char] != 0) {
                        temp_duplicates[box_char]--;
                    };
                } else if (box_char != current_letter && guess_word.includes(box_char)) {
                    if (temp_duplicates[box_char] > 0) {
                        box.style.backgroundColor = "#b79b42";
                        box.style.borderColor = "#b79b42";
                        box.style.color = "#ffffff";
                        temp_duplicates[box_char]--;
                    } else {
                        if (color_mode == "dark") {
                            box.style.backgroundColor = "#3a3a3c";
                            box.style.borderColor = "#3a3a3c";
                            box.style.color = "#ffffff";
                        } else {
                            box.style.backgroundColor = "#787c7f";
                            box.style.borderColor = "#787c7f";
                            box.style.color = "#ffffff";
                        };
                    };
                    
                } else if (box_char != current_letter) {
                    if (color_mode == "dark") {
                        box.style.backgroundColor = "#3a3a3c";
                        box.style.borderColor = "#3a3a3c";
                        box.style.color = "#ffffff";
                    } else if (color_mode == "light") {
                        box.style.backgroundColor = "#787c7f";
                        box.style.borderColor = "#787c7f";
                        box.style.color = "#ffffff";
                    };
                };

            }, i * 125);
        }, i * 250);
    };

    setTimeout(() => {
        isAnimating = false;
        
        console.log(correct_boxes)
        if (correct_boxes == 6) {
            document.removeEventListener("keydown", handleKeyPress);
            win_box = document.getElementsByClassName("winMsgBox")[0];
            win_box.classList.remove("animateMsgBox");
            void win_box.offsetWidth;
            win_box.classList.add("animateMsgBox");
            return;

        } else if (current_line_idx + 1 != 7) {
            temp_duplicates = {...duplicates};
            current_line_idx++;
            current_line = document.getElementById(`boxes${current_line_idx}`);
            current_box_idx = 0;
            current_box = current_line.children[current_box_idx];
            for (i=0; i<5; i++) {
                if (color_mode == "dark") {
                    current_line.children[i].style.borderColor = "#a5a7a8";
                } else {
                    current_line.children[i].style.borderColor = "#3a3a3c";
                };
            };

        } else {
            current_line_idx++;
            try {
                current_line = document.getElementById(`boxes${current_line_idx}`);
            } catch (err) {
                
            };
            
            lose_box = document.getElementsByClassName("loseMsgBox")[0];
            lose_box.textContent = `You lose! The word was: ${guess_word}`;
            lose_box.classList.remove("animateMsgBox");
            void lose_box.offsetWidth;
            lose_box.classList.add("animateMsgBox");
        };
    }, totalAnimationTime);
};

function handleKeyPress(event) {
    if (event.key.match(/^[a-zA-Z]$/)) {
        if (current_line.children[4].textContent == "") {
            let pressed_key = event.key.toUpperCase();
            current_box.textContent = pressed_key;

            current_box.classList.remove("animateBoxGrowAndShrink");
            void current_box.offsetWidth;
            current_box.classList.add("animateBoxGrowAndShrink");
            void current_box.offsetWidth;

            if (current_box_idx != 5) {
                current_box_idx++;
                current_box = current_line.children[current_box_idx];
            };
        };

    } else if (event.key == "Backspace") {
        if (current_box_idx > 0) {
                current_box_idx -= 1;
                current_box = current_line.children[current_box_idx];
                current_box.textContent = "";
        };

    } else if (event.key == "Enter") {
        if (current_line.children[4].textContent != "") {
            let input_word = "";
            for (let i=0; i < current_line.children.length; i++) {
                let temp_box_char = current_line.children[i].textContent;
                input_word += temp_box_char;
            };
            if (word_set.has(input_word.toLowerCase())) { 
                colorBoxes();
            } else {
                invalid_box = document.getElementsByClassName("invalidMsgBox")[0];
                invalid_box.classList.remove("animateMsgBox");
                void invalid_box.offsetWidth;
                invalid_box.classList.add("animateMsgBox");
            };
        };
    };
};

function getStyleSheet() {
    for (let sheet of styleSheets) {
        for (let i = 0; i < sheet.cssRules.length; i++) {
            const rule = sheet.cssRules[i];

            if (rule.selectorText === '.switchColorBtn:hover') {
                switchColorBtnHover = rule.style;
            }

            if (rule.selectorText === '.switchColorBtn:active:hover') {
                switchColorBtnActiveHover = rule.style;
            };
        };
    };
};

setBoardColor();
getStyleSheet();
loadWords();
