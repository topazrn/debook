const ASCII_a = "a".charCodeAt(0);
const ASCII_z = "z".charCodeAt(0);
const ASCII_A = "A".charCodeAt(0);
const ASCII_Z = "Z".charCodeAt(0);
const ASCII_0 = "0".charCodeAt(0);
const ASCII_9 = "9".charCodeAt(0);
const ASCII_space = " ".charCodeAt(0);

function isLowerCase(character = "") {
    if (character.charCodeAt(0) >= ASCII_a && character.charCodeAt(0) <= ASCII_z) {
        return true;
    }
    return false;
}

function isUpperCase(character = "") {
    if (character.charCodeAt(0) >= ASCII_A && character.charCodeAt(0) <= ASCII_Z) {
        return true;
    }
    return false;
}

function isLetter(character = "") {
    return isLowerCase(character) || isUpperCase(character) || character.charCodeAt(0) == ASCII_space;
}

function isNumber(character = "") {
    if (character.charCodeAt(0) >= ASCII_0 && character.charCodeAt(0) <= ASCII_9) {
        return true;
    }
    return false;
}