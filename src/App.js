import { Suspense } from 'react';

import './App.css';

const delay = (seconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Resolving');
      resolve();
    }, seconds * 1000);
  });
}

const delayForTenSeconds = () => {
  return {
    result: wrapPromise(delay(10))
  };
}

const delayForFiveSeconds = () => {
  return {
    result: wrapPromise(delay(5))
  };
}

const wrapPromise = (promise) => {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );

  return {
    read: () => {
      if (status === 'pending') {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === 'success') {
        return result;
      }
    }
  }
}


function App() {
  const resource = delayForTenSeconds();
  const resourceTwo = delayForFiveSeconds();

  return (
    <>
      <Suspense fallback={<p>Loading Child</p>}>        
        <ChildTwo resource={resourceTwo} />
        <Suspense fallback={<p>Loading Child Two</p>}>      
          <Child resource={resource} />
        </Suspense>
      </Suspense>      
    </>
  );
}

function Child({ resource }) {
  const value = resource.result.read();

  console.log('Child: ', value);

  return (
    <div>I am a child</div>
  );
}

function ChildTwo({ resource }) {
  const value = resource.result.read();

  console.log('Child Two: ', value);

  return (
    <div>I am a second child</div>
  );
}

export default App;
