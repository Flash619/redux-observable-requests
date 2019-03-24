import {AjaxError, AjaxRequest, AjaxResponse} from "rxjs/ajax";

export * from './utilities'
export * from './epics'
export type Method =
    'post' |
    'get' |
    'patch' |
    'put' |
    'update' |
    'head' |
    'delete'
export interface RequestAction {
    type: string
    request?: AjaxRequest
    meta?: any
    payload?:{
        request?:AjaxRequest
    }
}
export interface ResponseAction {
    type: string
    response?: AjaxResponse|AjaxError
    meta?: any
    payload?:{
        response?:AjaxResponse|AjaxError
    }
}