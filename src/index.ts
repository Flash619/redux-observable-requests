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
export interface ResponseAction extends AjaxResponse{
    type: string
    meta?: any
    payload?: AjaxResponse
}