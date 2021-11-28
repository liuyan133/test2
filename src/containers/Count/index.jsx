import React, { Component } from 'react'
import {  List, Avatar, Space, Button} from 'antd';
import { MessageOutlined, LikeOutlined, StarOutlined } from '@ant-design/icons'
import PubSub from 'pubsub-js'
import { addItem,delItem,increment,decrement } from '../../redux/actions/count'
import {connect} from 'react-redux'
import './index.css'


//定义UI组件
class Count extends Component {
  

  state = {
    isFirst:true,
    isLoading:false,
    err:''
  };
	
	addItem = (item)=>{
    const codeItem = this.props.codeItem
    const {title,href,description,key} = item
    if(codeItem.length === 0){
      const itemObj = {key,title,href,description}
      this.props.addItem(itemObj)
      this.increment()
      console.log('添加成功！')
    }else{
        const re = codeItem.filter(obj =>{
          return obj.key === key
        })

        if(re.length === 1){
          console.log('已添加，请勿重复添加！')
        }else{
            const itemObj = {key,title,href,description}
            this.props.addItem(itemObj)
            this.increment()
            console.log('添加成功！')
        }
        }
    }

    delItem = (item)=>{
      const codeItem = this.props.codeItem
      const {title,href,description,key} = item
      if(codeItem.length === 0){
        console.log('请先添加后再移除!')
      }else{
          const re = codeItem.filter(obj =>{
            return obj.key === key
          })
  
          if(re.length === 1){
            const itemObj = {key,title,href,description}
            this.props.delItem(itemObj)
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
    this.token = PubSub.subscribe('repositoyData',(_,stateObj)=>{
		this.setState(stateObj)
		})
  }

  componentWillUnmount(){
		PubSub.unsubscribe(this.token)
	}


	render() {
		const {isLoading,err} = this.state
    const {overall,allCode} = this.props
    const isFirst = (allCode.length === 0 ? true:false)
    const listData = allCode.map((userObj)=>{         
        return(
            {
              key: userObj.html_url,
              href: userObj.html_url,
              title: userObj.name,
              avatar: 'https://joeschmoe.io/api/v1/random',
              description: userObj.description
            }
          )
        })

    const IconText = ({ icon, text }) => (
          <Space>
            {React.createElement(icon)}
            {text}
          </Space>
    );
		return (
				<div > 
          <h2>下载总数:{overall}</h2>
            {   
                isFirst ? <h2 style={{color:'green'}}>欢迎使用搜索仓库</h2>:
                isLoading ? <h2 style={{color:'yellow'}}>Loading</h2>:
                err ? <h2 style={{color:'red'}}>{err}</h2>:
                <List
                    itemLayout="vertical"
                    size="small"
                    pagination={{
                      pageSize: 4,
                    }}
                    dataSource={listData}
                    renderItem={item => (
                      <List.Item
                        key={item.key}
                        actions={[
                        <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                      ]}
                      // extra={
                      //   <img
                      //     width={120}
                      //     alt="logo"
                      //     src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                      //   />
                      // }
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} />}
                        title={<a href={item.href}>{item.title}</a>}
                        description={
                          <div>
                          {item.description}              
                              <a href={item.href} target="_blank" rel="noreferrer">
                              打开链接 
                              </a>
                          <Button 
                          type='primary'
                          onClick={ ()=>{
                            this.addItem(item)
                          }}
                          style={{marginLeft:10}}>                    
                           添加下载
                          </Button>
                          <Button 
                          type='danger'
                          onClick={ ()=>{
                            this.delItem(item)
                          }}
                          style={{marginLeft:10}}>                    
                           移除下载
                          </Button>
                          </div>
                        } 
                        />
                      </List.Item>
            )}
            />
             }
            </div> 
		)
	}
}

//使用connect()()创建并暴露一个Count的容器组件
export default connect(
	state => ({
    allCode:state.allCode,
    userItem:state.userItem,
    codeItem:state.codeItem,
    overall:state.overall,
	}),
	{addItem,delItem,increment,decrement}
)(Count)

