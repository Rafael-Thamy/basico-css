import "./App.css";

//react
import { useCallback, useEffect, useState } from "react";

//components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

//data
import { wordsList } from "./data/words";

//estagios da aplicação
const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 5;

function App() {
  //inicialização dos estados com hook
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [pickedWord, setPickedWord] = useState(" ");
  const [pickedCategory, setPickedCategory] = useState(" ");
  const [letters, setLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(5);
  const [score, setScore] = useState(0  );

  const pickWordAndCategory =useCallback( () => {
    //pick a random category
    const categories = Object.keys(words); //retorna um array
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];
    /*     console.log(category);
     */

    //pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    /*     console.log(word);
     */ return { word, category }; //retorna um objeto que será desestruturado a seguir dentro da função
  },[words]);

  //função para iniciar o jogo, que será passada como props para o componente StartScreen
  const startGame =useCallback(() => {
    //clear all letters
    clearLetterStates();

    //pick word and category
    const { word, category } = pickWordAndCategory(); // afunção retorna um objeto que será colocado no objeto desetruturado

    //create an array of letters
    let wordLetters = word.split("");
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(wordLetters);
    console.log(word, category);

    //set the states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters); //nesse ponto o professor colocou outro valor
    setGameStage(stages[1].name); //muda para o componente Game
  },[pickWordAndCategory]);

  //process the letter input
  const verifyLetter = (letter) => {
    const normalizeLetter = letter.toLowerCase();

    //check if the letter has already been used
    if (
      guessedLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    //push a guessed letter or remove a guess
    if (letters.includes(normalizeLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizeLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter,
      ]);
      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  //check the win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)]; //array de letras unicas

    //win condition
    if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
      setScore((actualScore) => (actualScore += 100));
      startGame();
    }
    console.log(uniqueLetters);
  }, [guessedLetters, letters, startGame]); //o que etrar dentro do array faz parte do ambiente de monitoramento

  //restart the game
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
