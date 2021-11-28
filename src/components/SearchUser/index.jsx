import React, { Component } from 'react'
import { Space } from 'antd';
import axios from 'axios'
import PubSub from 'pubsub-js'
import {connect} from 'react-redux'
import {addAllUser} from '../../redux/actions/count'
import './index.css';

class SearchUser extends Component {
 
  addAllUser = (allItem)=>{
    this.props.addAllUser(allItem)
	}

  search = ()=>{
    const {keyEl:{value}} = this
      PubSub.publish('userData',{isFirst:false,isLoading:true}) 
      axios.get(`http://api.github.com/search/users?q=${value}`).then( 
        response => {
            // this.props.updateAppState({isLoading:false,users:response.data.items})
            PubSub.publish('userData',{isLoading:false})
            this.addAllUser(response.data.items)          
            console.log('成功了',response.data.items)
        },
        error => 
        {
          PubSub.publish('userData',{isLoading:false,err:error.message})
          console.log('失败了',error.messgae)
        }
    )
}
  render(){
    
    return (     
      <Space direction="vertical">    
        <div>
          <input  ref={c => this.keyEl = c} type="text" placeholder="输入用户的关键字"/>&nbsp;
          <button  onClick={this.search}>搜索用户</button>
        </div>
      </Space>
    )
  }
}

export default connect(
	state => ({}),
	{addAllUser}
)(SearchUser)