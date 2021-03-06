import React from 'react';
import './styles/Question.css';
import moment from 'moment';
import axios from 'axios';
import ReactModal from 'react-modal';
import Answers from './Answers.jsx';
import Answer from './Answer.jsx';

ReactModal.setAppElement('#questions');

const customModalStyles = {
  overlay: { zIndex: 1000 }
}

class Question extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      answerDisplay: this.props.answers.length > 1 ? 'answers' : 'answer',
      answers: this.props.answers.length,
      votes: 0,
      downVotes: 0,
      highlight: false,
      loading: false,
      answered: false
    }

    this.upVotes = this.upVotes.bind(this);
    this.downVotes = this.downVotes.bind(this);
    this.popQuestion = this.popQuestion.bind(this);
    this.wasAnswered = this.wasAnswered.bind(this);
  }



  componentDidMount() {
    this.setState({
      answers: this.props.answers.length,
      votes: this.props.answers[0].upvotes
    })
  }

  componentDidUpdate(prevAnswers) {
    if (this.props.answers.length !== prevAnswers.answers.length) {
      let answersLength = this.props.answers.length;
      this.setState({
        answers: answersLength
      }, () => {
        if (this.state.answers > 1) {
          this.setState({ answerDisplay: 'answers' })
        } else {
          this.setState({ answerDisplay: 'answer' })
        }
      })
    }
    if (this.props.answers[0].upvotes !== prevAnswers.answers[0].upvotes) {
      this.setState({
        votes: this.props.answers[0].upvotes
      })
    }
  }

  popQuestion() {
    if (this.state.highlight) {
      this.setState({ highlight: false })
    } else {
      this.setState({ loading: true }, () => {
        setTimeout(() => {
          this.setState({ loading: false, highlight: true })
        }, 1000)
      })
    }
  }

  wasAnswered() {
    if (this.state.answered) {
      this.setState({ answered: false })
    } else {
      this.setState({ answered: true })
    }
  }

  upVotes() {
    axios.put('http://localhost:4000/' + this.props.answers[0].id)
      .then(() => {
        let newVotes = this.state.votes + 1;
        this.setState({
          votes: newVotes
        });
      })
  }

  downVotes() {
    this.setState({ downVotes: this.state.downVotes + 1 })
  }

  render() {
    if (!this.state.answers && !this.state.answerDisplay) {
      return (
        <>
          <ReactModal className="spinner" isOpen={this.state.loading} contentLabel="spinner" style={customModalStyles}></ReactModal>
        </>
      )
    } else {
      return (
        <>
          <ReactModal className="answered" isOpen={this.state.answered} style={customModalStyles}>
            <div className="submit-modal">
              <div className="check-container">
                <button onClick={this.wasAnswered} type="button" className="x-button">
                  <span className="x">x</span>
                </button>
              </div>
              <div className="image-container">
                <div>
                  <img className="checkbox-green" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfgg_Ow5Vww9CgzIezCKmTt0wa5up2ole-gNKcPlMGwHIcVV8&s" alt="green check mark"></img>
                </div>
                <div>
                  <span>Your answer was submitted!</span>
                </div>
              </div>
            </div>
          </ReactModal>
          <ReactModal className="spinner" isOpen={this.state.loading} contentLabel="spinner" style={customModalStyles}></ReactModal>
          <li className="item">
            <div className="content-header">
              <div className="left-content">
                <div className="user-and-time">
                  <span className="user">{this.props.user}</span>
                  <span className="dot">&#8226;</span>
                  <span className="time">{moment(this.props.dateAsked).fromNow()}</span>
                </div>
                <div className="question">
                  <h3 className="paul-h3"><a className="paul-a" href="#" onClick={this.popQuestion}>{this.props.question}</a></h3>
                </div>
              </div>
              <div className="right-content">
                <span>{this.state.answers}</span>
                <span className="ten-font">{this.state.answerDisplay}</span>
              </div>
            </div>
            <div className="button-answer">
              <button onClick={this.popQuestion} type="button">Answer the question</button>
            </div>
            <div className="answer-container">
              <div className="answer-content">
                <span className="user">{this.props.answers[0].user_name}</span>
                <span className="dot">&#8226;</span>
                <span className="time">{moment(this.props.answers[0].answered_at).fromNow()}</span>
              </div>
              <div className="answer">
                <span>{this.props.answers[0].answer}</span>
              </div>
              <div className="helpful">
                <span className="ten-font">Helpful?</span>
                <button type="button" onClick={this.upVotes}>Yes &#8226; {' '}{this.state.votes}</button>
                <button type="button" onClick={this.downVotes}>No &#8226; {' '}{this.state.downVotes}</button>
                <button type="button">Report as inappropriate</button>
              </div>
            </div>
          </li>
          <ReactModal questionId={this.props.questionId} className="my-modal" isOpen={this.state.highlight} style={customModalStyles}>
            <div className="modal-content">
              <div className="modal-header">
                <div className="left-header">
                  <span className="ask-display">Post Answer</span>
                </div>
                <div className="right-header">
                  <button onClick={this.popQuestion} type="button" className="x-button">
                    <span className="x">x</span>
                  </button>
                </div>
              </div>
              <li className="item">
                <div className="content-header">
                  <div className="left-content">
                    <div className="user-and-time">
                      <span className="user">{this.props.user}</span>
                      <span className="dot">&#8226;</span>
                      <span className="time">{moment(this.props.dateAsked).fromNow()}</span>
                    </div>
                    <div className="question">
                      <h3>{this.props.question}</h3>
                    </div>
                  </div>
                  <div className="right-content">
                    <span>{this.state.answers}</span>
                    <span className="ten-font">{this.state.answerDisplay}</span>
                  </div>
                </div>
                {this.props.answers.map((answer, index) => {
                  return (
                    <Answers votes={answer.upvotes} upVote={this.upVotes} downVote={this.downVotes} downVotes={this.state.downVotes} answer={answer} key={index} />
                  )
                })}
              </li>
              <Answer wasAnswered={this.wasAnswered} popQuestion={this.popQuestion} questionId={this.props.questionId} />
            </div>
          </ReactModal>
        </>
      )
    }
  }

}

export default Question;
