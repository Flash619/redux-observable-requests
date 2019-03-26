# redux-observable-requests
A lightweight minimalistic approach to AJAX requests using `rxjs` and `redux-observable`.

### Table of Contents

* [Getting Started](#getting-started)  
  * [Installation](#installation)  
  * [Implementation](#implementation)  
  * [Making Requests](#making-requests)  
  * [Reading Responses](#reading-responses)  
  * [Cancelling Duplicate Actions](#canceling-duplicate-actions)  
* [Typescript Support](#typescript-support)  
* [Contributing](#contributing)  

### Motivation

When working in multiple projects, boilerplate code can start to become an issue. Especially maintaining the boilerplate for AJAX requests among multiple projects. `redux-observable-requests` was created to centralize AJAX requests in one place, eliminate manually writting multiple action types for success, error, and abort actions, and provide a method to intercept requests and responses before they are dispatched, all while creating as small of a footprint as possible.

`redux-observable-requests` is designed to use as many internal `rxjs` components as possible. For this reason `redux-observable-requests` only uses the built in `rxjs/ajax` class when handing AJAX requests. Future versions may allow for the implementation of other third party request libraries. If you require any specific features, please submit an issue so I can better prioritize requests.
 
### Getting Started

#### Installation

```
npm install --save redux-observable-requests
```

#### Implementation

```javascript
// Import the custom request subscriber generator.
import {generateRequestSubscriber} from 'redux-observable-requests'

// Add the request subscriber to your root epic.
combineEpics(
    rootEpic,
    generateRequestSubscriber()
);
```

Optionally, you can pass custom callback functions to the request subscriber generator to alter actions before they are dispatched, dispatch other actions, or run side effects.

```javascript
// Import the custom request subscriber generator.
import {generateRequestSubscriber} from 'redux-observable-requests'

const handleSuccessAction = (responseAction) => {
    // Normalize responseAction.response, log console data, etc...
    return responseAction // Callback functions must return an action. This action is passed along to dispatch.
}

const handleAbortAction = (responseAction) => {
    console.error(`Action ${responseAction.meta.originalAction.type} aborted.`);
    return responseAction
}

const handleRequestAction = (requestAction) => {
    // Add authorization tokens, log activity, dispatch side effects, etc...
    return requestAction
}


// Add the request subscriber to your root epic.
combineEpics(
    rootEpic,
    generateRequestSubscriber({
        onSuccess: handleSuccessAction,
        onAbort: handleAbortAction,
        onRequest: handleRequestAction
    })
);
```

#### Making Requests

Simply add a `request` property inside of a redux action. FSA complaint actions will be detected maintained depending on the location of the `request` key.

The `request` property values are directly passed to `rxjs/ajax` and is a type of `AjaxRequest`. The `response` property within a responding action of a request action extends a type of `AjaxResponse`.

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

Any properties in the original actions `meta` property will be copied to the responding actions `meta` property.

`AjaxResponse.response` Is mapped to `ResponseAction.response` and contains only the web servers response data, whereas the full `AjaxResponse` can be found under `ResponseAction.meta.ajaxResponse`. For more information on structure, refer to `index.ts` which shows the type interfaces for response actions.

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

#### Canceling Duplicate Actions

If a request action has been dispatched, any other actions with the same type will automatically be aborted until the original action is completed. Aborted requests will trigger an abort action to be dispatched. Aborted requests are not qued and are currently discarded. You can retreive an aborted request by watching for the abort action, and retreiving the original request from `action.meta.originalAction.request`.

### Typescript Support

Typescript is fully supported and `redux-observable-requests` is written natively using Typescript.

```javascript
export const getUser: RequestAction = (userId: number) => ({
    type: 'GET_USER',
    request: {
       url: `https://someapi/users/${userId}`,
       method: 'get'
    },
})
```

```javascript
const users = (state: User[], action: ResponseAction) => {
    switch(action.type) {
        case success('GET_USER'):
            return [...state, action.response.response]
    }
}

const userErrors = (state: UserError[], action: ResponseAction) => {
    switch(action.type) {
        case error('GET_USER'):
            return [...state, action.response.response]
    }
}

const abortedActions = (state: any[], action: ResponseAction) => {
    switch(action.type) {
        case abort('GET_USER'):
            return [...state, action.meta.originalAction]
    }
}
```

```javascript
const handleSuccessAction = (responseAction: ResponseAction): ResponseAction => {
    // Normalize responseAction.response, log console data, etc...
    return responseAction
}

const handleAbortAction = (responseAction: ResponseAction): ResponseAction => {
    console.error(`Action ${responseAction.meta.originalAction.type} aborted.`);
    return responseAction
}

const handleRequestAction = (requestAction: RequestAction): ResponseAction => {
    // Add authorization tokens, log activity, dispatch side effects, etc...
    return requestAction
}

combineEpics(
    rootEpic,
    generateRequestSubscriber({
        onSuccess: handleSuccessAction,
        onAbort: handleAbortAction,
        onRequest: handleRequestAction
    })
);
```

### Contributing

All contributions are welcome, however I would ask that any and all pull requests have a corresponding issue first, just so we can figure out any details prior to work being performed.