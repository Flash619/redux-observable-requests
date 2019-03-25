import {AjaxError, AjaxRequest, AjaxResponse} from "rxjs/ajax";

export * from './utilities'
export * from './epics'

export interface RequestAction {
    type: string
    request?: AjaxRequest
    meta?: {[key:string]:any}
    payload?:{
        request?:AjaxRequest
    }
}

export interface ResponseAction{
    type: string
    meta: {
        [key:string]:any
        originalAction: RequestAction
    }
    response?: AjaxResponse|AjaxError
    payload?: {
        response: AjaxResponse|AjaxError
    }
}