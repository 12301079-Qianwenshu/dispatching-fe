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
}

export default CommonStore