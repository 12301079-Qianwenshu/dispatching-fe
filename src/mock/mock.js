/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-06-02 15:15:46
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-05 14:42:42
 */
import Mock from 'mockjs'
import API from '../api/index'

export const taglist = Mock.mock(API.Tag.getTagList, {
    "taglist|2": [
        {
            "title|+1": [
                "基础分类",
                "业务分类"
            ],
            "root": true,
            "count|1-100": 100,
            "remark": "这是备注",
            "children|1-2": [
                {
                    "title|+1": [
                        "未分类",
                        "分类-1",
                    ],
                    "count|1-100": 100,
                    "root": false,
                    "remark": "这是备注",
                    "children|0-1": [
                        {
                            "title|+1": [
                                "分类-1-1"
                            ],
                            "count|1-100": 100,
                            "root": false,
                            "remark": "这是备注",
                        }
                    ]
                }
            ]
        }
    ]
})

export const singlelist = Mock.mock(API.Single.getSingleList, {
    "singlelist|10": [
        {
            "id|+1": 1,
            "name": "这是一个单轮意图名称",
            "answer": '<p>这是一段描述，关于这个单轮意图的答案描述</p>',
            "updatetime": '2020-05-11 14:38:00',
            "status|1": true,
            "entityList|2": [
                {
                    "value|+1": [
                        "实体1,词典1",
                        "实体2,词典2"
                    ]
                }
            ],
            "kgList|2": [
                {
                    "name|+1": [
                        "知识1",
                        "知识2"
                    ],
                    "link|+1": [
                        "链接1",
                        "链接2"
                    ]
                }
            ],
            "askInfoList": [
                "提问方式1",
                "提问方式2"
            ],
            "similarSingleList": [
                {
                    "id": 999,
                    "name": "这是一个单轮意图名称",
                    "answer": '<p>这是一段描述，关于这个单轮意图的答案描述</p>',
                    "updatetime": '2020-05-11 14:38:00',
                    "status": true
                }
            ]
        }
    ],
    "all_counts|12-50": 25
})

export const multilist = Mock.mock(API.Multi.getMultiList, {
    "multilist|10": [
        {
            "id|+1": 1,
            "name": "这是一个多轮意图名称",
            "updatetime": '2020-05-11 14:38:00',
            "status|1": true
        }
    ],
    "all_counts|12-50": 25
})
