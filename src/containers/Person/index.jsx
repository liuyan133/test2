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
			title: '??????',
			dataIndex: 'name',
			width: '22%',
		  },
		  {
			title: '??????',
			dataIndex: 'href',
		  },
		  {
			title: '??????',
			dataIndex: 'description',
		  },
		  {
			title: '??????',
			dataIndex: 'operation',
			width: '10%',
			render: (_, record) =>
			  this.state.dataSource.length >= 1 ? (
				<Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record,record.key)}>
				  <Button 
				  type='danger'>
					  ????????????
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
			  content: '????????????',
			  className: 'custom-class',
			  style: {
				marginTop: '20vh',
			  },
			});
		  };

		  download = ()=>{
			const temp = [];
			this.state.dataSource.map(item => {
				 // ??????????????????
				return temp.push(
						   {
							   '??????':item.name,
							   '??????':item.href, 
							   '??????':item.description, 
						   }
					   )
				 })
				// ????????????excel??????
				this.downloadFileToExcel()
		  }


		  downloadFileToExcel = () => {
			let option = {};  //option???????????????excel??????
			option.fileName = 'github???';  //excel????????????
			option.datas = [
				{
					sheetData: this.state.dataSource,  //excel?????????????????????
					sheetName: 'Info',  //excel?????????sheet?????????
					// sheetFilter: ['????????????', '????????????', '????????????'],  //excel??????????????????????????????
					sheetHeader:['??????', '??????', '??????']  //excel??????????????????????????????
				}
			]
			let toExcel = new ExportJsonExcel(option);  //??????excel??????
			toExcel.saveExcel();  //??????excel??????
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
		<h2>????????????:{overall}</h2>
        <Button
          onClick={this.download}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          ??????Excel
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
	}),//????????????
	{increment,decrement,delItem,addItem,delUser}//???????????????????????????
)(Person)
