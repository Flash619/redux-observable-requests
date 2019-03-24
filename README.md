# redux-observable-requests
A lightweight minimalistic approach to AJAX requests using `rxjs` and `redux-observable`.

### Table of Contents

### Motivation

Redux Observable Requests was created to handle AJAX requests, and dispatch success, error, and abort actions respectively. In the past I had used `redux-saga-requests` and was inspired by it's simplicity. Unfortunately, I could not find a similar library for `redux-observable`. I decided to make a lightweight library focused on handling AJAX requests using `redux-observable` while trying to maintain the same action structure and tool-set of `redux-saga-requests` to minimalise any potential refactor. 

Where `redux-saga-requests` allows for multiple request libraries to be used, `redux-observable-requests` is designed to use as many internal `rxjs` components as possible. For this reason `redux-observable-requests` only uses the built in `rxjs/ajax` class.

### Getting Started

#### Installation

```
npm install --save redux-observable-requests
```

#### Implementation

```javascript
// Import the custom request subscriber.
import {requestSubscriber} from 'redux-observable-requests'

// Add the request subscriber to your root epic.
combineEpics(
    rootEpic,
    requestSubscriber
);
```

#### Making Requests

Simply pass a `request` property to a redux action. FSA complaint actions will be detected and maintained depending on the location of the `request` key.

The `request` property is directly passed to `rxjs/ajax` and is a type of `AjaxRequest`. The `response` action of the requesting action extends a type of `AjaxResponse` but retains the `type` property.

```javascript
export const getUser = (userId) => ({
    type: 'GET_USER',
    request: {
       url: `https://someapi/users/${userId}`,
       method: 'get'
    },
})
```

#### Reading Responses

Responding actions will be either of error, success, or abort. Action types are appended to the original action type. To help streamline implementation helper functions have been provided.

```javascript
// Import the success helper function.
import {success} from 'redux-observable-requests'

const users = (state: [], action) => {
    switch(action.type) {
        case success('GET_USER'):
            return [...state, action.response]
    }
}
```

