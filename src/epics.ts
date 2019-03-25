import {Epic} from "redux-observable";
import {catchError, filter, map, mergeMap, tap} from "rxjs/operators";
import {generateAjaxRequest, generateRequestAbortAction, generateRequestResponseAction, isRequest} from "./utilities";
import {of} from "rxjs";

const activeActions: string[] = [];

const removeActiveAction = (action: string) => activeActions.splice(activeActions.indexOf(action), 1);
const addActiveAction = (action: string) => activeActions.push(action);
const isActiveAction = (action: string) => activeActions.indexOf(action) !== -1;

export const requestSubscriber: Epic<any> = action$ => action$.pipe(
    filter(action => isRequest(action)),
    mergeMap(action => {
            if (isActiveAction(action.type)) {
                return of(generateRequestAbortAction(action))
            } else {
                addActiveAction(action.type);
                return generateAjaxRequest(action).pipe(
                    tap(response => removeActiveAction(action.type)),
                    map(response => generateRequestResponseAction(action, response)),
                    catchError(error => of(generateRequestResponseAction(action, error)))
                )
            }
        }
    )
);