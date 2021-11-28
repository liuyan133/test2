import React, { Component } from 'react'
import {connect} from 'react-redux'
import PubSub from 'pubsub-js'
import { addUser,delUser,increment,decrement } from '../../redux/actions/count'
import { Button ,Card ,List } from 'antd'
import './index.css'


 class User extends Component {
    state = {
        isFirst:true,
        isLoading:false,
        err:''
      };

      addUser = (item)=>{
        const userItem = this.props.userItem
        const {key,href,description,title} = item
        if(userItem.length === 0){
            const itemObj = {key,title,href,description}
            this.props.addUser(itemObj)
            this.increment()
            console.log('添加成功！')
          }else{
              const re = userItem.filter(obj =>{
                return obj.key === key
              })
      
              if(re.length === 1){
                console.log('已添加，请勿重复添加！')
              }else{
                  const itemObj = {key,title,href,description}
                  this.props.addUser(itemObj)
                  this.increment()
                  console.log('添加成功！')
              }
            }
        }

        delUser = (item)=>{
            const userItem = this.props.userItem
            const {title,href,description,key} = item
            if(userItem.length === 0){
              console.log('请先添加后再移除!')
            }else{
                const re = userItem.filter(obj =>{
                  return obj.key === key
                })
        
                if(re.length === 1){
                  const itemObj = {key,title,href,description}
                  this.props.delUser(itemObj)
                  this.decrement()
                  console.log('移除成功！')
                }else{             
                    console.log('请先添加后再移除!')
                }
                }
            }
    

        increment = ()=>{
            this.props.increment(1)
        }

        decrement = ()=>{
            this.props.decrement(1)
        }
      
      componentDidMount(){
        this.token = PubSub.subscribe('userData',(_,stateObj)=>{
                this.setState(stateObj)
            })
      }
    
      componentWillUnmount(){
            PubSub.unsubscribe(this.token)
        }

    render() {
    const {isLoading,err} = this.state
    const {overall,allUser} = this.props
    const isFirst = (allUser.length === 0 ? true:false)

    const data = allUser.map((userObj)=>{         
        return(
            {
              key: userObj.html_url,
              href: userObj.html_url,
              title: userObj.login,
              description: userObj.avatar_url
            }
          )
        })
        return (
            
            <div className="row"> 
            <h2>下载总数:{overall}</h2>
            {   
                isFirst ? <h2 style={{color:'green'}}>欢迎使用搜索用户</h2>:
                isLoading ? <h2 style={{color:'yellow'}}>Loading</h2>:
                err ? <h2 style={{color:'red'}}>{err}</h2>:
                <List
                    grid={{ gutter: 4, column: 4 }}
                    dataSource={data}
                    renderItem={item => (
                    <List.Item>
                        <Card  key={item.key} title={item.title}>
                            <a href={item.html_url} target="_blank" rel="noreferrer">
                                <img src={item.description} alt="pic" style={{width: '100px'}}/>
                            </a>            
                            <Button 
                                type='primary'
                                onClick={ ()=>{
                                    this.addUser(item)
                                }}
                                style={{marginLeft:10}}>                    
                                添加下载
                            </Button>
                            <Button 
                                type='danger'
                                onClick={ ()=>{
                                    this.delUser(item)
                                }}
                                style={{marginLeft:10}}>                    
                                移除下载
                            </Button>       
                        </Card>
                    </List.Item>
                    )}
              />
            }
            </div> 
            
        )
    }
         
}

export default connect(
	state => ({
        allUser:state.allUser,
        userItem:state.userItem,
        overall:state.overall,
	}),
	{addUser,delUser,increment,decrement}
)(User)
