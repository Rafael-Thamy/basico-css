import "./StartScreen.css";

//a props startGame(que é uma função) será passada no componente que será renderizado no
//componente pai - App.js- porém no próprio componente StartScreen
const StartScreen = ({startGame}) => {
  return (
    <div className="start">
      <h1>Secret Word</h1>
      <p>Clique no botão abaixo para jogar</p>
      <button onClick={startGame}>Inicie o jogo</button>
    </div>
  );
};

export default StartScreen;
