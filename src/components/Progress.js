function Progress({ index, numQuestion, points, maxPossiblePoints, answer }) {
  return (
    <header className='progress'>
      <progress max={numQuestion} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQuestion}
      </p>

      <p>
        <strong>{points}</strong> / {maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;

/* here we use the more semantic header element so a header inside the main part which is perfectly semantic */

/* in the progress bar we use a nice trick which is to convert to a number from a boolean that will result from checking if there is an answer or not meaning if there is no answer then it will be false then number will convert that false to a zero and vice versa */
