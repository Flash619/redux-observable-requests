import {Epic} from "redux-observable";
import {catchError, filter, map, mergeMap, take} from "rxjs/operators";
import {generateAjaxRequest, generateRequestAbortAction, generateRequestResponseAction, isRequest} from "./utilities";
import {of, race} from "rxjs";

const requestSubscriber: Epic<any> = action$ => action$.pipe(
    filter(action => isRequest(action)),
    mergeMap(action =>
        race(
            generateAjaxRequest(action).pipe(
                map(response => generateRequestResponseAction(action, response)),
                catchError(error => of(generateRequestResponseAction(action, error)))
            ),
            action$.pipe(
                filter(nextAction => (nextAction.type === action.type)),
                map((nextAction) => generateRequestAbortAction(nextAction)),
                take(1)
            )
        )
    )
);