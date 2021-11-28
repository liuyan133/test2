import {
    ADD_ITEM,
    DEL_ITEM,
    ADD_All,
    ADD_AllUser,
    ADD_USER,
    DEL_USER,
    INCREMENT,
    DECREMENT
} from '../constant'

//创建增加一个人的action动作对象
export const addItem = personObj => ({type:ADD_ITEM,data:personObj})
export const delItem = personObj => ({type:DEL_ITEM,data:personObj})
export const addAll = Items => ({type:ADD_All,data:Items})
// addAllUser
export const addAllUser = Items => ({type:ADD_AllUser,data:Items})
export const addUser = personObj => ({type:ADD_USER,data:personObj})
export const delUser = personObj => ({type:DEL_USER,data:personObj})

export const increment = data => ({type:INCREMENT,data})
export const decrement = data => ({type:DECREMENT,data})