import React, { Component } from 'react';
import axios from 'axios';
import { uuid } from 'uuidv4';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import RefreshIcon from '@material-ui/icons/Refresh';

import './KnowledgeCheckBlock.css'

class KnowledgeCheckBlock extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmit: false,
      isCorrect: false,
      showRetake: false,
      selectedOption: "",
      knowledgeCheck: []
    }
  }

  handleOptionChange = e => {
    this.setState({
      selectedOption: e.target.value,
      isCorrect: JSON.parse(e.target.name)
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.setState({
      isSubmit: true,
    });
  };

  handleRetakeClick = e => {
    this.setState({
      isSubmit: false,
      selectedOption: ""
    });
  };

  actionSection() {
    return this.state.isSubmit === false
      ?
        this.renderSubmitButton()
      :
        this.renderFeedback();
  }

  async componentDidMount() {
    const response = await axios.get('http://localhost:5000/knowledge-check-blocks');
    console.log(response.data[0]);

    this.setState({ knowledgeCheck: response.data[0] });
  }

  renderSubmitButton() {
    const { selectedOption } = this.state;
    const isDisabled = selectedOption.length < 1

    return (
      <div className="KnowledgeCheckBlock-submit">
        <button disabled={isDisabled} >Submit</button>
      </div>
    );
  }

  renderAnswers() {
    const { answers } = this.state.knowledgeCheck;
    const { isSubmit } = this.state;

    return answers.map(answer => {
      return (
        <div key={uuid()} className="KnowledgeCheckBlock-answers">
          <label>
            <input
              type="radio"
              disabled={isSubmit}
              name={answer.isCorrect.toString()}
              value={answer.text}
              checked={this.state.selectedOption === answer.text}
              onChange={this.handleOptionChange}
            />
            {answer.text}
          </label>
        </div>
      );
    });
  }


  renderFeedback() {
    const { feedback } = this.state.knowledgeCheck;
    const { isCorrect } = this.state;

    return(
      <div>
        <div className="KnowledgeCheckBlock-feedback">
          {
            isCorrect === true ?
            (
              <>
              <CheckCircleOutlineIcon style={{ fontSize: 70 }}/>
              <div>Correct</div>
              </>
            ) : (
              <>
              <HighlightOffIcon style={{ fontSize: 70 }} />
              <div>Incorrect</div>
              </>
            )
          }
          <p>{feedback}</p>
        </div>

        <div className="KnowledgeCheckBlock-retake" onClick={this.handleRetakeClick}>
          <div className="KnowledgeCheckBlock-retake-text">take again</div>
          <RefreshIcon fontSize="large" />
        </div>
      </div>
    );
  }

  render() {
    const { question } = this.state.knowledgeCheck;

    if (!question) return <div>loading...</div>;

    return (
      <div className="KnowledgeCheckBlock">
        <form className="KnowledgeCheckBlock-content" onSubmit={this.handleFormSubmit}>
          <div className="KnowledgeCheckBlock-question">
            <p>{question.text}</p>
          </div>

          <img className="KnowledgeCheckBlock-media" src={question.media.url} alt={question.media.type} />

          <div className="KnowledgeCheckBlock-answers-content">
            {this.renderAnswers()}
          </div>

          <div className="KnowledgeCheckBlock-action">
            {this.actionSection()}
          </div>
        </form>
      </div>
    );
  }
}

export default KnowledgeCheckBlock;