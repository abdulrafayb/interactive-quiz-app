import { useEffect, useReducer } from 'react';

import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';
import Footer from './Footer';
import Timer from './Timer';

/* const hardCodedQuestions = [
  {
    question: 'Which is the most popular JavaScript framework?',
    options: ['Angular', 'React', 'Svelte', 'Vue'],
    correctOption: 1,
    points: 10,
  },
  {
    question: 'Which company invented React?',
    options: ['Google', 'Apple', 'Netflix', 'Facebook'],
    correctOption: 3,
    points: 10,
  },
  {
    question: "What's the fundamental building block of React apps?",
    options: ['Components', 'Blocks', 'Elements', 'Effects'],
    correctOption: 0,
    points: 10,
  },
  {
    question:
      "What's the name of the syntax we use to describe the UI in React components?",
    options: ['FBJ', 'Babel', 'JSX', 'ES2015'],
    correctOption: 2,
    points: 10,
  },
  {
    question: 'How does data flow naturally in React apps?',
    options: [
      'From parents to children',
      'From children to parents',
      'Both ways',
      'The developers decides',
    ],
    correctOption: 0,
    points: 10,
  },
  {
    question: 'How to pass data into a child component?',
    options: ['State', 'Props', 'PropTypes', 'Parameters'],
    correctOption: 1,
    points: 10,
  },
  {
    question: 'When to use derived state?',
    options: [
      'Whenever the state should not trigger a re-render',
      'Whenever the state can be synchronized with an effect',
      'Whenever the state should be accessible to all components',
      'Whenever the state can be computed from another state variable',
    ],
    correctOption: 3,
    points: 30,
  },
  {
    question: 'What triggers a UI re-render in React?',
    options: [
      'Running an effect',
      'Passing props',
      'Updating state',
      'Adding event listeners to DOM elements',
    ],
    correctOption: 2,
    points: 20,
  },
  {
    question: 'When do we directly "touch" the DOM in React?',
    options: [
      'When we need to listen to an event',
      'When we need to change the UI',
      'When we need to add styles',
      'Almost never',
    ],
    correctOption: 3,
    points: 20,
  },
  {
    question: 'In what situation do we use a callback to update state?',
    options: [
      'When updating the state will be slow',
      'When the updated state is very data-intensive',
      'When the state update should happen faster',
      'When the new state depends on the previous state',
    ],
    correctOption: 3,
    points: 30,
  },
  {
    question:
      'If we pass a function to useState, when will that function be called?',
    options: [
      'On each re-render',
      'Each time we update the state',
      'Only on the initial render',
      'The first time we update the state',
    ],
    correctOption: 2,
    points: 30,
  },
  {
    question:
      "Which hook to use for an API request on the component's initial render?",
    options: ['useState', 'useEffect', 'useRef', 'useReducer'],
    correctOption: 1,
    points: 10,
  },
  {
    question: 'Which variables should go into the useEffect dependency array?',
    options: [
      'Usually none',
      'All our state variables',
      'All state and props referenced in the effect',
      'All variables needed for clean up',
    ],
    correctOption: 2,
    points: 30,
  },
  {
    question: 'An effect will always run on the initial render.',
    options: [
      'True',
      'It depends on the dependency array',
      'False',
      'In depends on the code in the effect',
    ],
    correctOption: 0,
    points: 30,
  },
  {
    question: "When will an effect run if it doesn't have a dependency array?",
    options: [
      'Only when the component mounts',
      'Only when the component unmounts',
      'The first time the component re-renders',
      'Each time the component is re-rendered',
    ],
    correctOption: 3,
    points: 20,
  },
]; */

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'dataReceived':
      return { ...state, questions: action.payload, status: 'ready' };

    case 'dataFailed':
      return { ...state, status: 'error' };

    case 'start':
      return {
        ...state,
        status: 'active',
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };

    case 'newAnswer':
      const question = state.questions.at(state.index); // to figure out which is the current question

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };

    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };

    case 'restart':
      return { ...initialState, questions: state.questions, status: 'ready' };
    // return { ...state, points: 0, highscore: 0, index: 0, answer: null, status: 'ready' };

    case 'tick':
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? 'finished' : state.status,
      };

    default:
      throw new Error('Action unknown');
  }
}

export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'dataReceived', payload: data }))
      .catch((err) => dispatch({ type: 'dataFailed' }));
  }, []);

  /* useEffect(function () {
    dispatch({ type: 'dataReceived', payload: hardCodedQuestions });
  }, []); */

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}

        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}

        {status === 'active' && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}

        {status === 'finished' && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

/* now we are gonna set up a fake api on a fake web server then use that api to load the questions data into our application which we have created ourselves because of that we can't use a real api but we still are gonna pretend that we are loading these questions from somewhere and therefore we are gonna create a fake api using an npm package called json-server and in order to be able to call that package meaning to run the json-server command we need to add a new npm script in our package-json file and then we run it in a different terminal with the command 'npm run server' then it creates a local host */

/* now we are gonna grab that url which we created then fetch it into our application we do it not with asycn/await but we use the then method to handle the promise and now we will need that data so we can display it in the UI for that we are gonna need state but instead of useState we are gonna use the useReducer hook to create the state */

/* in our initial state, we also want a loading state that tells the user that questions are being fetched however this time we will do it in a different way not like we have previously done (isLoading) but instead we will use a status state which will basically be a string and will tell us the current status of the application as it changes throughout time but in the beginning it will be in the loading state and other different states are written up there and this is a nicer way of handling all these diferent statuses that the application can be in instead of having to create states for each different status totaling to five states and it has got nothing to do with useReducer its just a technique */

/* we will use the status to display different things in the UI so when there is an error we will display that error and if the status is ready then we will display the questions and we did not pass in any payload in the error because we are not interested in the error that we are going to receive so all we do is tell our state that the status is an error now and display a custom message that we have created */

/* as soon as our data is successfully fetched we dispatch the action telling our reducer that the type of the action is 'dataReceived' and the payload is the actual data then the reducer receives that action in the reducer function handling it and also at the same time we set our status state to 'ready' as well by just dispatching one simple event */

/* now we are gonna handle different status that the application can have so at the beginning it is in loading status then after we receive some data it changes to ready status and when we click on the start button we want to display the questions so all we have to do is to set the state to active */

/* above we are passing the dispatch function around just like before we were passing event handler functions or set state functions around when we used the useState hook */

/* now we are gonna render and display the questions one by one but for that we need a way of knowing which question is the current one meaning we need some way of keeping track which question is the current one and for that we need to add a new piece of state and we name it index which starts at zero because we will use this index to take a certain question object out of the questions array as the first element of the questions array is element number zero and by changing the index we can change the question which should then re-render the screen therefore index needs to be a state variable and that is the reasoning behind why it needs to be state variable because it needs to re-render the screen once it is updated */

/* now we are gonna implement the logic to handle the answers and we want three things to happen when we select an option so the correct and wrong answers should be highlighted also the points should be updated and the button to go to the next question should appear and for all this to happen when we click an option we need to re-render the screen meaning that we need a new piece of state (answer) which needs to store which of the option was selected and our buttons are created from an array so we also are going to use index numbers for them like we have in the map function */

/* to take care of the points so when the user clicks on an option we also need to update points meaning we again would need state (points) as that is something we want displayed on the screen and we update the points in the same place where we receive the answer and points are only awarded when the answer is correct */

/* now we are gonna take care of third part where we move to the next question as soon as the answer have been given meaning when the user clicks on one of the options we want a button to appear which will take the user to the next question and all that means we have to increase the index as it is based on index that the current question is being read and then displayed so create another action for that in the reducer function */

/* now we are gonna display the progress that the user makes in the quiz which is the third part and we want to show the current question out of the total number of questions and also the current points out of the total number of points and also a progress bar so create a component for it as we have for other parts */

/* now we are gonna implement the functionality of actually finishing the quiz meaning after the user has given the answer to the last question then we want our application to move into the finished status so that then we can display the finish screen */

/* now we are gonna implement a simple feature that allows a user to restart the quiz and with our reducer that we already have in place this is almost too easy as we have updated related pieces of state so many times and this pattern makes the state logic that we have above so decoupled from all the different components which makes it helpful to understand what is happening because all we have to do is read through all the cases we have above then we can easily understand what is happening in our application and how the state transitions even without understanding much of the application and reducer makes our state updates a lot more declarative as we just map different actions in it to do state transitions */

/* now we are going to use effects to implement a timer feature and this new feature will play really nicely with the reducer that we already have so when the game starts then the timer will also start then once the timer reaches zero we will have the game stop by setting the status to finished again and we will able to model this behaviour really beautifully with the reducer */
