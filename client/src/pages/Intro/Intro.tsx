import "./Intro.css";
import halfLogo from "../../assets/half-logo.png";
import icon1 from "../../assets/icon1.png";
import icon2 from "../../assets/icon2.png";
import icon3 from "../../assets/icon3.png";
import { useNavigate } from "react-router-dom";

export default function Intro() {
  const navigate = useNavigate();
  function handleOnClick() {
    navigate('/knowledge')
  }
  return <div className="intro">
    <div className="intro__title">
      <h1 className="intro__title__text">Welcome to Mesh AI</h1>
      <img src={halfLogo} className="intro__title__logo"/>
    </div>
    <div className="intro__graphics">
      <div className="intro__graphic">
        <img src={icon1} className="intro__graphic__icon" />
        <p className="intro__graphic__text">Bring all your documents into one secure AI workspace</p>
      </div>
      <div className="intro__graphic">
        <img src={icon2} className="intro__graphic__icon" />
        <p className="intro__graphic__text">Organize and manage the documents that power your AI</p>
      </div>
      <div className="intro__graphic">
        <img src={icon3} className="intro__graphic__icon" />
        <p className="intro__graphic__text">Your knowledge base, accessible through a simple chat interface</p>
      </div>
    </div>
    <p className="intro__text">Start by creating your Organisation’s Knowledge Base</p>
    <div className="intro__btn-container"><button className="intro__btn-container__btn" onClick={handleOnClick}>Start</button></div>
  </div>;
}