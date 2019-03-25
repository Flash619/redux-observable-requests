import {ActionsObservable, StateObservable} from "redux-observable";
import {requestSubscriber} from "../epics";
import {Subject} from "rxjs";
import {isAbort, isError} from "../utilities";

test('requstSubscriber properly returns error action.',() => {
    const action = {
        type: 'users/GET',
        request: {
            url: '127.0.0.1'
        }
    };
    const action$ = ActionsObservable.from([action]);
    const state$ = new StateObservable(new Subject(), {});
    requestSubscriber(action$,state$,[])
        .subscribe((action) => {
            if (!isError(action.type)) {
                fail('Epic did not return action of correct type.')
            }
        })
});

test('requstSubscriber properly returns abort action.',() => {
    const action = {
        type: 'users/GET',
        request: {
            url: '127.0.0.1'
        }
    };
    const action$ = ActionsObservable.from([action,action]);
    const state$ = new StateObservable(new Subject(), {});
    requestSubscriber(action$,state$,[])
        .subscribe((action) => {
            if (!isAbort(action.type)) {
                fail('Epic did not return action of correct type.')
            }
        })
});