import { AjaxError, AjaxRequest, AjaxResponse } from "rxjs/ajax";

export * from "./utilities";
export * from "./epics";

export interface RequestSubscriberOptions {
  onRequest?: (requestAction: RequestAction) => RequestAction | null;
  onSuccess?: (responseAction: ResponseAction) => ResponseAction;
  onError?: (responseAction: ResponseAction) => ResponseAction;
  onAbort?: (responseAction: ResponseAction) => ResponseAction;
}

export interface RequestAction {
  type: string;
  request?: AjaxRequest;
  meta?: { [key: string]: any };
  payload?: {
    request?: AjaxRequest;
  };
}

export interface ResponseAction {
  type: string;
  meta: {
    [key: string]: any;
    originalAction: RequestAction;
    ajaxResponse?: AjaxResponse | AjaxError;
  };
  response?: AjaxResponse["response"] | AjaxError["response"];
  payload?: {
    response: AjaxResponse["response"] | AjaxError["response"];
  };
}
