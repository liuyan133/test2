/* 
	该文件用于汇总所有的reducer为一个总的reducer
*/
//引入combineReducers，用于汇总多个reducer
import {combineReducers} from 'redux'
//引入为Count组件服务的reducer
import count from './count'
import code from './code'
import user from './user'
import person from './person'
import overall from './overall'

//汇总所有的reducer变为一个总的reducer
export default  combineReducers({
	allCode:count,
	codeItem:code,
	userItem:person,
	allUser:user,
	overall:overall,
})
