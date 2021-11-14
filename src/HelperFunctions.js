// Simple helper function to receive a string, and return the same string with an uppercase first character and lowercase every-other-character.
export function CapitalizeWord(word) {
    return `${word.substring(0, 1).toUpperCase()}${word.substring(1).toLowerCase()}`;
}