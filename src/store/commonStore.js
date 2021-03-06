/*
 * @Description: 
 * @Author: shuqianwen
 * @Date: 2020-06-16 10:00:00
 * @LastEditors: shuqianwen
 * @LastEditTime: 2020-06-16 10:24:43
 */
import { observable, action } from "mobx";

class CommonStore {
    @observable selectedTrackList = []
    @action setSelectedTrackList(data) {
        this.selectedTrackList = data
    }

    @observable userinfo = null
    @action setUserinfo(data) {
        this.userinfo = data
    }

    @observable count = null
    @action setCount(data) {
        this.count = data
    }
}

export default CommonStore