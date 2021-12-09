import React, { Component,useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form ,message} from 'antd';
import {connect} from 'react-redux'
import { nanoid } from 'nanoid';
import ExportJsonExcel from 'js-export-excel'
import { increment,decrement,delItem,addItem,delUser } from '../../redux/actions/count'

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
				<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record,record.key)}>
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

		this.state = {
			dataSource:temp,
			count:temp.length,
		  };		
		}	
		
		decrement = ()=>{
			this.props.decrement(1)
		}

	handleDelete = (record,key) => {
			const dataSource = [...this.state.dataSource];
			this.setState({
			  dataSource: dataSource.filter((item) => item.key !== key),
			});
			this.props.delItem(record)
			this.props.delUser(record)
			this.decrement()
			this.success1()
		};
		success1 = () => {
			message.success({
			  content: '移除成功',
			  className: 'custom-class',
			  style: {
				marginTop: '20vh',
			  },
			});
		  };

		  download = ()=>{
			const temp = [];
			this.state.dataSource.map(item => {
				 // 表头一一对应
				return temp.push(
						   {
							   '标题':item.name,
							   '链接':item.href, 
							   '描述':item.description, 
						   }
					   )
				 })
				// 调用导出excel方法
				this.downloadFileToExcel()
		  }


		  downloadFileToExcel = () => {
			let option = {};  //option代表的就是excel文件
			option.fileName = 'github表';  //excel文件名称
			option.datas = [
				{
					sheetData: this.state.dataSource,  //excel文件中的数据源
					sheetName: 'Info',  //excel文件中sheet页名称
					// sheetFilter: ['你的名称', '我的名称', '你的编号'],  //excel文件中需显示的列数据
					sheetHeader:['标题', '链接', '描述']  //excel文件中每列的表头名称
				}
			]
			let toExcel = new ExportJsonExcel(option);  //生成excel文件
			toExcel.saveExcel();  //下载excel文件
		}

	
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
          onClick={this.download}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          导出Excel
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
	{increment,decrement,delItem,addItem,delUser}//映射操作状态的方法
)(Person)
