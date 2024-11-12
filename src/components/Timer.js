import { useEffect } from 'react';

function Timer({ dispatch, secondsRemaining }) {
  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: 'tick' });
      }, 1000);

      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className='timer'>
      {mins < 10 && '0'}
      {mins}:{seconds < 10 && '0'}
      {seconds}
    </div>
  );
}

export default Timer;

/* here we use the useEffect hook to create a side effect on mount meaning as this component mounts we want to initialize the timer and we are starting the timer right here because this component will mount as soon as the game starts because ofcourse we could not start the timer in the app component because then the timer will start running as soon as the entire application mounts but that is not what we want so we have to place this effect into one of the components that mounts as the game starts */
