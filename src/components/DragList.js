/**
 * Created by edeity on 2018/3/2.
 */
import React, { Component } from 'react'
import { Row, Col, Form, Select, InputNumber, Tabs, Button, Popover, Tooltip, Upload } from 'antd'
import DragCard from './DragCard'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CompTypes, { getCompConfig }  from '../constants/CompTypes'
import { CompactPicker } from 'react-color'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import SyntaxHighlighter from 'react-syntax-highlighter/prism'
import { docco } from 'react-syntax-highlighter/styles/hljs'
import file from '../tool/files'
import data from '../constants/pivotData'
import {
    changeCol, changeComp, changeHeight, changeBgColor,
    setCompCollection, changeRowDim, changeColDim, changeRenderValue
} from '../actions/CompAction'

const Option = Select.Option
const FormItem = Form.Item
const TabPane = Tabs.TabPane
const ButtonGroup = Button.Group

const compList = Object.values(CompTypes)
const dataFields = data[0]
const fieldKeys = Object.values(dataFields)

class DragList extends Component {

    static propTypes = {
        focusIndex: PropTypes.number.isRequired,
        compCollection: PropTypes.array.isRequired,
    }

    onHeightChange = (value) => {
        this.props.changeHeight(value)
    }

    onBgChange = (color) => {
        this.props.changeBgColor(color.hex)
    }

    colSelect = (value) => {
        this.props.changeCol(value)
    }

    compSelect = (value) => {
        this.props.changeComp(value)
    }

    /**
     * 获得列宽的选择（初次为24网格布局）
     */
    getColSelector = () => {
        let colSelector = [];
        for (let i = 1; i <= 24; i++) {
            colSelector.push(<Option key={i} value={i}>{i}</Option>)
        }
        return colSelector;
    }

    /**
     * 获取维度的选择项
     */
    getDataDimSelector = () => {
        return fieldKeys.map(eachField => {
            return <Option key="eachField" value={eachField}>{eachField}</Option>
        })
    }

    render() {
        const focusComp = this.props.compCollection[this.props.focusIndex]
        let compAttr
        if(focusComp) {
            compAttr = getCompConfig(focusComp.compType)
        }
        const compCollectionConfig = JSON.stringify(this.props.compCollection).replace(/{/g, '\n {').replace(/}/g, '}\n')
        // 读取文件配置，该组件仅用于读取
        const uploadProps = {
            accept: '.json',
            action: 'https://dashboard.edeity.me',
            showUploadList: false,
            beforeUpload: (file) => {
                var reader = new FileReader()
                reader.onload = ((file) => {
                    return (e) => {
                        this.props.setCompCollection(JSON.parse(e.target.result))
                    };
                })(file);
                reader.readAsText(file)
                return false
            }
        };

        return (
            <div className="drag-list">
                <div className="drag-total">
                    <Tabs defaultActiveKey="drag-comp" size="small">
                        <TabPane tab="拖拽组件" key="drag-comp">
                            <Row>
                                {
                                    compList.map((eachCompType, index) => {
                                        return (
                                            <Col span="6" key={index}>
                                                <DragCard type={eachCompType} />
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </TabPane>
                        <TabPane tab="生成配置" key="str-config">
                            <Row className="config-bar">
                                <Col span="24">
                                    <CopyToClipboard text={compCollectionConfig}>
                                        <ButtonGroup>
                                            <Popover content={"复制成功"} trigger="click">
                                                <Tooltip placement="top" title={"复制"}>
                                                    <Button icon="copy" size="small" />
                                                </Tooltip>
                                            </Popover>
                                            <Tooltip placement="top" title={"导出配置"}>
                                                <Button icon="download" size="small"
                                                    onClick={() => { file.save('config.json', compCollectionConfig) }} />
                                            </Tooltip>
                                            <Upload {...uploadProps}>
                                                <Tooltip placement="top" title={"导入配置"}>
                                                    <Button icon="upload" size="small" />
                                                </Tooltip>
                                            </Upload>
                                        </ButtonGroup>
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                            <SyntaxHighlighter
                                language='javascript'
                                style={docco}>{
                                    compCollectionConfig
                                }</SyntaxHighlighter>
                        </TabPane>
                    </Tabs>
                </div>
                <div className="drag-config">
                    {
                        focusComp &&
                        (
                            <Tabs defaultActiveKey="drag-base" size="small">
                                <TabPane tab="样式配置" key="drag-base">
                                    <Form>
                                        <Row gutter={24}>
                                            <Col span={12}>
                                                <FormItem label={"列宽"} style={{ display: 'flex' }}>
                                                    <Select value={focusComp.col}
                                                        size="small"
                                                        onSelect={this.colSelect}>
                                                        {this.getColSelector()}
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span={12}>
                                                <FormItem label={"类型"} style={{ display: 'flex' }}>
                                                    <Select value={focusComp.compType}
                                                        size="small"
                                                        onSelect={this.compSelect}>
                                                        {
                                                            compList.map((eachCompType, index) => {
                                                                return (
                                                                    <Option key={index}
                                                                        value={eachCompType}>{eachCompType}</Option>
                                                                )
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <FormItem label={"高度"}
                                                    style={{ display: 'flex' }}
                                                    labelCol={{ span: 3 }}>
                                                    <InputNumber value={focusComp.height}
                                                        size="small"
                                                        onChange={this.onHeightChange} />
                                                </FormItem>
                                            </Col>
                                            <Col span={24}>
                                                <label>背景颜色：</label>
                                                <div className="color-container">
                                                    <Popover content={
                                                        <CompactPicker style={{ paddingTop: 10 }} color={focusComp.bgColor}
                                                            onChange={this.onBgChange} />}
                                                        title="请选择颜色">
                                                        <div className="color-block"
                                                            style={{ backgroundColor: focusComp.bgColor }}
                                                            onClick={this.__handleBgColorClick}>
                                                        </div>
                                                    </Popover>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Form>
                                </TabPane>
                               
                                <TabPane tab="维度设置" key="base-data">
                                    <Select style={{ width: 200 }}
                                        value={focusComp.rowDim}
                                        placeholder="请选择维度值"
                                        mode={compAttr.x}
                                        onChange={value => this.props.changeRowDim(value)}>
                                        {this.getDataDimSelector()}
                                    </Select>
                                    <Select style={{ width: 200 }}
                                        value={focusComp.colDim}
                                        placeholder="请选择对比值"
                                        mode={compAttr.y}
                                        onChange={value => this.props.changeColDim(value)}>
                                        {this.getDataDimSelector()}
                                    </Select>
                                </TabPane>
                            </Tabs>
                        )
                    }

                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        focusIndex: state.dragStore.focusIndex,
        compCollection: state.dragStore.compCollection,
    }
}

export default connect(mapStateToProps,
    {
        changeCol, changeComp, changeHeight, changeBgColor,
        setCompCollection, changeRowDim, changeColDim, changeRenderValue
    })(DragList);