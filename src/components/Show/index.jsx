import React, { Component,lazy,Suspense} from 'react'
import { Layout, Menu, Breadcrumb } from 'antd';
import {Link,Route} from 'react-router-dom'
import {
  FileOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Loading from '../Loading'
import './index.css'

const Person = lazy(()=> import('../../containers/Person')) 
const User = lazy(()=> import('../../containers/User')) 
const Count = lazy(()=> import('../../containers/Count')) 
const SearchUser = lazy(()=> import('../SearchUser')) 
const SearchGood = lazy(()=> import('../SearchGood')) 
const Title = lazy(()=> import('../Title')) 
const { Header, Content, Footer, Sider } = Layout;

export default   class Show extends Component {

        state = {
          collapsed: false
        };

        onCollapse = collapsed => {
          this.setState({ collapsed });
        };
      
        render() {
          const { collapsed } = this.state;
          return (
            <Layout style={{ minHeight: '100vh' }}>
              <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1"icon={<HomeOutlined />}>   
                      <Link  to="/count">仓库</Link>  
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>   
                      <Link  to="/user">用户</Link> 
                    </Menu.Item>                
                    <Menu.Item key="3" icon={<FileOutlined />}>                  
                      <Link  to="/person">下载</Link>                     
                    </Menu.Item>
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} >
                <Suspense fallback={<Loading/>}>	
                      <Route path='/user' component={SearchUser}/>	
                      <Route path='/count' component={SearchGood}/>	
                      <Route path='/person' component={Title}/>
                    </Suspense>		
                </Header>
                <Content style={{ margin: '0 16px' }}>
                  <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>内容区：</Breadcrumb.Item>
                  </Breadcrumb>
                  <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                    <Suspense fallback={<Loading/>}>
                      <Route path='/count' component={Count}/>	
                      <Route path='/user' component={User}/>	
                      <Route path='/person' component={Person}/>	
                    </Suspense>								  
                  </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>GitHub Search Created by Liu Yan</Footer>
              </Layout>
            </Layout>
          );
        }
      }