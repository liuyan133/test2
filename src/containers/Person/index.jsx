import React, { Component,useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import {connect} from 'react-redux'
import { nanoid } from 'nanoid';
import { increment,decrement } from '../../redux/actions/count'

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
	  <Form form={form} component={false}>
		<EditableContext.Provider value={form}>
		  <tr {...props} />
		</EditableContext.Provider>
	  </Form>
	);
  };

  const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
  }) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef(null);
	const form = useContext(EditableContext);
	useEffect(() => {
	  if (editing) {
		inputRef.current.focus();
	  }
	}, [editing]);

	const toggleEdit = () => {
		setEditing(!editing);
		form.setFieldsValue({
		  [dataIndex]: record[dataIndex],
		});
	  };
	
	  const save = async () => {
		try {
		  const values = await form.validateFields();
		  toggleEdit();
		  handleSave({ ...record, ...values });
		} catch (errInfo) {
		  console.log('Save failed:', errInfo);
		}
	  };

	  let childNode = children;

	  if (editable) {
		childNode = editing ? (
		  <Form.Item
			style={{
			  margin: 0,
			}}
			name={dataIndex}
			rules={[
			  {
				required: true,
				message: `${title} is required.`,
			  },
			]}
		  >
			<Input ref={inputRef} onPressEnter={save} onBlur={save} />
		  </Form.Item>
		) : (
		  <div
			className="editable-cell-value-wrap"
			style={{
			  paddingRight: 24,
			}}
			onClick={toggleEdit}
		  >
			{children}
		  </div>
		);
	  }
	
	  return <td {...restProps}>{childNode}</td>;
	};

class Person extends Component {
	
	constructor(props) {
		super(props);
		this.columns = [
		  {
			title: '标题',
			dataIndex: 'name',
			width: '22%',
			editable: true,
		  },
		  {
			title: '链接',
			dataIndex: 'href',
		  },
		  {
			title: '描述',
			dataIndex: 'description',
		  },
		  {
			title: '操作',
			dataIndex: 'operation',
			width: '10%',
			render: (_, record) =>
			  this.state.dataSource.length >= 1 ? (
				<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
				  <Button 
				  type='danger'>
					  移除下载
					</Button>
				</Popconfirm>
			  ) : null,
		  },
		];
	
		const codes  = this.props.codes
		const users  = this.props.users
		let temp = []
		codes.forEach(element => {
			temp.push({
				key: element.key,
				name: element.title,
				href: element.href,
				description: element.description,
			 })
		});

		users.forEach(element => {
			temp.push({
				key: element.key,
				name: element.title,
				href: element.href,
				description: element.description,
			 })
		});
		// console.log(temp);

		this.state = {
			dataSource:temp,
			count:temp.length,
		  };		
		}	

		increment = ()=>{
			this.props.increment(1)
		  }
		
		  decrement = ()=>{
			this.props.decrement(1)
		  }

	handleDelete = (key) => {
			const dataSource = [...this.state.dataSource];
			this.setState({
			  dataSource: dataSource.filter((item) => item.key !== key),
			});
			this.decrement()
		};
	handleAdd = () => {
			this.increment()
			const { count, dataSource } = this.state;
			const newData = {
			  key: count,
			  name: `Edward King ${count}`,
			  herf: '32',
			  description: `London, Park Lane no. ${count}`,
			};
			this.setState({
			  dataSource: [...dataSource, newData],
			  count: count + 1,
			});
		};
	handleSave = (row) => {
			const newData = [...this.state.dataSource];
			const index = newData.findIndex((item) => row.key === item.key);
			const item = newData[index];
			newData.splice(index, 1, { ...item, ...row });
			this.setState({
			  dataSource: newData,
			});
		};
	
	render() {
	const overall = this.props.overall
	const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
	};

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
		<h2>下载总数:{overall}</h2>
        <Button
          onClick={this.handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          自定义添加
        </Button>
        <Table
		  rowKey={() => nanoid()}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}
	
export default connect(
	state => ({
		codes:state.codeItem,
		users:state.userItem,
		overall:state.overall
	}),//映射状态
	{increment,decrement}//映射操作状态的方法
)(Person)
