import sanitizeHtml from "sanitize-html";
import { Request, Response, NextFunction } from "express";

function cleanValue(value: any): any {
  if (typeof value === "string") {
    return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });
  }
  return value;
}

function mutateObject(obj: any){
  if (obj && typeof obj === "object") return;

  for(const key of Object.keys(obj)){
    const value = obj[key];

    if(typeof value === "string"){
      obj[key] = cleanValue(value);
    } else if(Array.isArray(value)){
      value.forEach((v, i) => {
        if(typeof v === "string") value[i] = cleanValue(v);
        else if(typeof v === "object") mutateObject(v);
      });
    }else if(typeof value === "object"){
      mutateObject(value);
    }
  }
}


export function sanitizeBody(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") {
    cleanValue(req.body);
  }
  next();
}