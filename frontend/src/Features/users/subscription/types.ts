
export type plan = {
    _id:string
    name:string
    price:number
    billingCycleDays:number
    features:string[]
    isActive:boolean
    limitations:Record<string,number>
}