import React, { Component } from 'react'
import { Space,Button } from 'antd';
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
      axios.get(`https://api.github.com/search/users?q=${value}`).then( 
        response => {
            PubSub.publish('userData',{isLoading:false})
            this.addAllUser(response.data.items)          
        },
        error => 
        {
          PubSub.publish('userData',{isLoading:false,err:error.message})
        }
    )
}
  render(){
    return (     
      <Space direction="horizontal">    
        <div>
          <input className="box1" ref={c => this.keyEl = c} type="text" placeholder="输入用户的关键字"/>&nbsp;
          <Button  onClick={this.search}>搜索用户</Button>
        </div>
      </Space>
    )
  }
}

export default connect(
	state => ({}),
	{addAllUser}
)(SearchUser)