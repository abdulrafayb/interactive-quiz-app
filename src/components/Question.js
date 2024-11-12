import Options from './Options';

function Question({ question, dispatch, answer }) {
  // console.log(question);

  return (
    <div>
      <h4>{question.question}</h4>
      <Options question={question} dispatch={dispatch} answer={answer} />
    </div>
  );
}

export default Question;

/* we do not use the ordered list because we do not have list elements but actual buttons */

/* we are gonna split the above code into two components because whenever there is a list that we will put into other component we create a separate component (not necessarily) and when creating so many components it is a common practice to create a new folder called components and then there we create our component */
