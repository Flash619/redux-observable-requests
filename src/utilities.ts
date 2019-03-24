import {RequestAction, ResponseAction} from "./index";
import {ajax, AjaxError, AjaxRequest, AjaxResponse} from 'rxjs/ajax';

//-----------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------

export const success = (action: string) => `${action}_SUCCESS`;
export const error = (action: string) => `${action}_ERROR`;
export const abort = (action: string) => `${action}_ABORT`;
export const isSuccess = (action: string) => /_SUCCESS$/.test(action);
export const isError = (action: string) => /_ERROR$/.test(action);
export const isAbort = (action: string) => /_ABORT$/.test(action);
export const isRequest = (action: RequestAction) => (action.request != null || (action.payload != null && action.payload.request != null));
export const isFSARequest = (action: RequestAction) => (action.payload != null && action.payload.request != null);
export const isErrorStatus = (status: number) => (status > 299);
export const isOkStatus = (status: number) => !isErrorStatus(status);

//-----------------------------------------------------------------
// Epic Utilities
//-----------------------------------------------------------------

export const generateAjaxRequest = (requestAction: RequestAction) => {
    let request : AjaxRequest = {} as AjaxRequest;
    if (isFSARequest(requestAction)) {
        // @ts-ignore Ignored because the above function will return false if action.payload.request is undefined.
        request = requestAction.payload.request
    } else if(requestAction.request != null) {
        request = requestAction.request
    }
    return ajax({...request});
};

export const generateRequestResponseAction = (requestAction: RequestAction, response: AjaxResponse) => {
    const type = (isErrorStatus(response.status))? error(requestAction.type) : success(requestAction.type)
    let action = {} as ResponseAction
    if (isFSARequest(requestAction)) {
        // @ts-ignore We need to follow FSA.
        action = {payload:{...response}, type}
    } else {
        action = {...response, type}
    }
    action.meta = requestAction.meta;
    return action
};

export const generateRequestAbortAction = (requestAction: RequestAction) => {
    let action = requestAction
    action.type = abort(requestAction.type);
    return action
}