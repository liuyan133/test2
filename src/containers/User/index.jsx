import React, { Component } from 'react'
import {connect} from 'react-redux'
import PubSub from 'pubsub-js'
import { addUser,delUser,increment,decrement } from '../../redux/actions/count'
import { Button ,Card ,List ,message} from 'antd'
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
            this.success1()
          }else{
              const re = userItem.filter(obj =>{
                return obj.key === key
              })
      
              if(re.length === 1){
                this.error1()
              }else{
                  const itemObj = {key,title,href,description}
                  this.props.addUser(itemObj)
                  this.increment()
                  this.success1()
              }
            }
        }

        delUser = (item)=>{
            const userItem = this.props.userItem
            const {title,href,description,key} = item
            if(userItem.length === 0){
              this.error2()
            }else{
                const re = userItem.filter(obj =>{
                  return obj.key === key
                })
        
                if(re.length === 1){
                  const itemObj = {key,title,href,description}
                  this.props.delUser(itemObj)
                  this.decrement()
                  this.success2()
                }else{             
                  this.error2()
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
        success1 = () => {
          message.success({
            content: '????????????',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
        };
      
        success2 = () => {
          message.success({
            content: '????????????',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
        };
      
        error1 = () => {
          message.error({
            content: '?????????????????????????????????',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
        };
      
        error2 = () => {
          message.error({
            content: '????????????????????????!',
            className: 'custom-class',
            style: {
              marginTop: '20vh',
            },
          });
        };
      
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
            <h2>????????????:{overall}</h2>
            {   
                isFirst ? <h2 style={{color:'green'}}>????????????????????????</h2>:
                isLoading ? <h2 style={{color:'yellow'}}>Loading</h2>:
                err ? <h2 style={{color:'red'}}>{err}</h2>:
                <List
                    pagination={{
                      pageSize: 8,
                    }}
                    grid={{ gutter: 8, column: 4 }}
                    dataSource={data}
                    renderItem={item => (
                    <List.Item>
                        <Card  key={item.key} title={item.title}>
                            <a href={item.href} target="_blank" rel="noreferrer">
                                <img src={item.description} alt="pic" style={{width: '100px'}}/>
                            </a>    
                            <div>      
                            <Button 
                                type='primary'
                                onClick={ ()=>{
                                    this.addUser(item)
                                }}
                                style={{marginLeft:10}}>                    
                                ????????????
                            </Button>
                            <Button 
                                type='danger'
                                onClick={ ()=>{
                                    this.delUser(item)
                                }}
                                style={{marginLeft:10}}>                    
                                ????????????
                            </Button>  
                            </div>       
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
