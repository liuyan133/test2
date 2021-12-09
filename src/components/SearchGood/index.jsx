import React, { Component } from 'react'
import { Space,Button } from 'antd';
import axios from 'axios'
import PubSub from 'pubsub-js'
import {connect} from 'react-redux'
import {addAll} from '../../redux/actions/count'
import './index.css';

class SearchGood extends Component {
 
  addAll = (allItem)=>{
    this.props.addAll(allItem)
	}

  search = ()=>{
    const {keyEl:{value}} = this
    PubSub.publish('repositoyData',{isFirst:false,isLoading:true})
    axios.get(`https://api.github.com/search/repositories?q=${value}`).then( 
        response => {
            // this.props.updateAppState({isLoading:false,users:response.data.items})
            PubSub.publish('repositoyData',{isLoading:false})
            this.addAll(response.data.items)          
        },
        error => 
        {
          PubSub.publish('repositoyData',{isLoading:false,err:error.message})
        }
    )
}
  render(){
    
    return (     
      <Space direction="vertical">    
        <div>
          <input className="box1" ref={c => this.keyEl = c} type="text" placeholder="输入仓库的关键字"/>&nbsp;
          <Button  onClick={this.search}>搜索</Button>
        </div>
      </Space>
    )
  }
}

export default connect(
	state => ({}),
	{addAll}
)(SearchGood)