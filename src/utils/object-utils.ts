export const isEmpty = (obj: any) => obj === null
    || obj === ''
    || obj === undefined
    || obj.length === 0
    || (Object.keys(obj).length === 0 && obj.constructor === Object);