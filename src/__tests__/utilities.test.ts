import * as utilities from '../utilities'
import {AjaxRequest, AjaxResponse} from "rxjs/ajax";
import {generateRequestAbortAction, generateRequestResponseAction, isAbort, isError, isSuccess} from "../utilities";
import {RequestAction} from "../index";

//-----------------------------------------------------------------
// Utility Functions
//-----------------------------------------------------------------

const fsaAction = {
    type: 'TEST',
    payload: {
        request: {} as AjaxRequest
    }
}

const nonFSAAction = {
    type: 'TEST',
    request: {} as AjaxRequest
}

test('success',() => {
    expect(utilities.success('TEST')).toBe('TEST_SUCCESS')
});

test('error',() => {
    expect(utilities.error('TEST')).toBe('TEST_ERROR')
});

test('abort',() => {
    expect(utilities.abort('TEST')).toBe('TEST_ABORT')
});

test('isSuccess',() => {
    expect(utilities.isSuccess(utilities.success('TEST'))).toBe(true)
});

test('isError',() => {
    expect(utilities.isError(utilities.error('TEST'))).toBe(true)
});

test('isAbort',() => {
    expect(utilities.isAbort(utilities.abort('TEST'))).toBe(true)
});

test('isRequest Non FSA',() => {
    expect(utilities.isRequest(nonFSAAction)).toBe(true)
});

test('isRequest FSA',() => {
    expect(utilities.isRequest(fsaAction)).toBe(true)
});

test('isFSARequest',() => {
    expect(utilities.isRequest(fsaAction)).toBe(true)
});

test('isErrorStatus',() => {
    expect(utilities.isErrorStatus(400)).toBe(true)
});

test('isErrorStatus',() => {
    expect(utilities.isErrorStatus(203)).toBe(false)
});

test('isOkStatus',() => {
    expect(utilities.isOkStatus(203)).toBe(true)
});

//-----------------------------------------------------------------
// Epic Utilities
//-----------------------------------------------------------------

test('generateRequestResponseAction FSA 401 (Error)',() => {
    const response = {} as AjaxResponse;
    response.status = 401;
    const request = {} as RequestAction;
    request.type = 'TEST';
    request.meta = 'META_TEST';
    request.payload = {
        request: {} as AjaxRequest
    };
    const action = generateRequestResponseAction(request, response);
    expect(isError(action.type)).toBe(true);
    expect(action.type).toBe('TEST_ERROR');
    expect(action.payload != null).toBe(true);
    // @ts-ignore
    expect(action.payload.response != null).toBe(true);
    // @ts-ignore
    expect(action.payload.response.status).toBe(401);
    expect(action.meta).toBe('META_TEST');
});

test('generateRequestResponseAction Non FSA 203 (Success)',() => {
    const response = {} as AjaxResponse;
    response.status = 203;
    const request = {} as RequestAction;
    request.type = 'TEST';
    request.meta = 'META_TEST';
    request.request = {} as AjaxRequest;
    const action = generateRequestResponseAction(request, response);
    expect(isSuccess(action.type)).toBe(true);
    expect(action.type).toBe('TEST_SUCCESS');
    expect(action.response != null).toBe(true);
    // @ts-ignore
    expect(action.response.status).toBe(203);
    expect(action.meta).toBe('META_TEST');
});

test('generateRequestAbortAction',() => {
    let request = {} as RequestAction;
    request.type = 'TEST';
    request.meta = 'META_TEST';
    request.payload = {
        request: {} as AjaxRequest
    };
    let action = generateRequestAbortAction(request);
    expect(isAbort(action.type)).toBe(true);
    delete action.type
    delete request.type
    expect(JSON.stringify(action)).toBe(JSON.stringify(request))
});