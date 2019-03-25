import {RequestAction, ResponseAction} from "./index";
import {ajax, AjaxRequest, AjaxResponse} from 'rxjs/ajax';

//-----------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------

export const success = (action: string): string => `${action}_SUCCESS`;
export const error = (action: string): string => `${action}_ERROR`;
export const abort = (action: string): string => `${action}_ABORT`;
export const isSuccess = (action: string): boolean => action.endsWith('_SUCCESS');
export const isError = (action: string): boolean => action.endsWith('_ERROR');
export const isAbort = (action: string): boolean => action.endsWith('_ABORT');
export const isRequest = (action: RequestAction): boolean => (action.request != null || (action.payload != null && action.payload.request != null));
export const isFSARequest = (action: RequestAction): boolean => (action.payload != null && action.payload.request != null);
export const isErrorStatus = (status: number): boolean => (status > 299);
export const isOkStatus = (status: number): boolean => !isErrorStatus(status);

//-----------------------------------------------------------------
// Epic Utilities
//-----------------------------------------------------------------

export const generateAjaxRequest = (requestAction: RequestAction) => {
    let request: AjaxRequest = {} as AjaxRequest;
    if (isFSARequest(requestAction)) {
        // @ts-ignore Ignored because the above function will return false if action.payload.request is undefined.
        request = requestAction.payload.request
    } else if (requestAction.request != null) {
        request = requestAction.request
    }
    return ajax({...request});
};

export const generateRequestResponseAction = (requestAction: RequestAction, response: AjaxResponse) => {
    const type = (isErrorStatus(response.status)) ? error(requestAction.type) : success(requestAction.type);
    let action = {} as ResponseAction;
    if (isFSARequest(requestAction)) {
        // @ts-ignore We need to follow FSA.
        action =
            {
                payload: {response: {...response}},
                type
            }
    } else {
        // @ts-ignore We add meta after this if statement.
        action = {response:{...response}, type}
    }
    action.meta = {
        ...requestAction.meta,
        originalAction: {...requestAction}
    };
    return action
};

export const generateRequestAbortAction = (requestAction: RequestAction) => {
    return {
        type: abort(requestAction.type),
        meta: {
            ...requestAction.meta,
            originalAction: requestAction
        }
    };
};