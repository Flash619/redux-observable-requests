import {Epic} from "redux-observable";
import {catchError, filter, map, mergeMap, tap} from "rxjs/operators";
import {generateAjaxRequest, generateRequestAbortAction, generateRequestResponseAction, isRequest} from "./utilities";
import {of} from "rxjs";
import {RequestAction, RequestSubscriberOptions} from "./index";
import {AjaxResponse} from "rxjs/ajax";

//-----------------------------------------------------------------
// Active/Pending request tracing.
//-----------------------------------------------------------------

const activeActions: string[] = [];

const removeActiveAction = (action: string) => activeActions.splice(activeActions.indexOf(action), 1);
const addActiveAction = (action: string) => activeActions.push(action);
const isActiveAction = (action: string) => activeActions.indexOf(action) !== -1;

//-----------------------------------------------------------------
// High order epic generation.
//-----------------------------------------------------------------

export const generateRequestSubscriber = (options?: RequestSubscriberOptions) => {

    // Request/Response Handlers

    const handleRequest = (action: RequestAction) => {
        if (options && options.onRequest != null) {
            return options.onRequest(action)
        }
        return action
    };

    const handleAbort = (action: RequestAction) => {
        let nextAction = generateRequestAbortAction(action);
        if (options != null && options.onAbort != null) {
            nextAction = options.onAbort(nextAction)
        }
        return nextAction
    };

    const handleSuccess = (action: RequestAction, response: AjaxResponse) => {
        let nextAction = generateRequestResponseAction(action, response);
        if (options != null && options.onSuccess != null) {
            nextAction = options.onSuccess(nextAction)
        }
        return nextAction
    };

    const handleError = (action: RequestAction, error: AjaxResponse) => {
        let nextAction = generateRequestResponseAction(action, error);
        if (options != null && options.onError != null) {
            nextAction = options.onError(nextAction)
        }
        return nextAction
    };

    // Epic / RXJS

    const requestSubscriber: Epic<any> = action$ => action$.pipe(
        filter(action => isRequest(action)),
        mergeMap(action => {
                if (isActiveAction(action.type)) {
                    return of(handleAbort(action));
                } else {
                    addActiveAction(action.type);
                    action = handleRequest(action);
                    return generateAjaxRequest(action).pipe(
                        tap(response => removeActiveAction(action.type)),
                        map(response => handleSuccess(action, response)),
                        catchError(error => of(handleError(action, error)))
                    )
                }
            }
        )
    );

    return requestSubscriber
};