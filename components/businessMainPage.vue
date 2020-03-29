<template>
    <view class="business-banner">
        <text class="scan-tip">扫一扫来访用户的权益卡二维码，完成权益卡核实。</text>
        <view class="scan-btn" @click="startScan">扫一扫</view> 
        
        <view class="loading-container" v-if="showWaiting">   
            <view class="mask"></view>             
            <view class="container">
                <img src="/static/loading.svg" >
                <view class="loading-warning">等待用户支付</view>
                <view class="loading-warning">请保持该页面不要关闭</view>
            </view>  
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'businessMainPage',    
    computed: {
        ...mapState(['userInfo'])
    },
    data() {
        return {
            showWaiting:false
        }
    },
    methods: {
        startScan () {
            let that = this
            uni.scanCode({
                onlyFromCamera: true,
                scanType: 'QR_CODE',
                success (res) {
                    that.postData(res.result)
                },
                fail () {
                    that.$tip.toast('扫描失败,请重试','none')
                }
            })
        },
        async postData (val) {
            let temp = JSON.parse(val)
            // let now = new Date().getTime()
            // if (now - temp.t > 120000) {
            //     this.$tip.alertDialog('该二维码已超过两分钟有效时间，请提示用户刷新二维码后重试')
            //     return 
            // }
            let params = {
                ...temp
            }
            const res = await this.$api.venueOrder(params)
            if (res.code === 0) {   
                this.showWaiting = true
                this.adminLoopFn(res.data.id)
            } else {
                this.$tip.alertDialog('扫描失败，请重试','知道了')
            }
        },
        async adminLoopFn (id) {
            let params = {
                order_id: id
            }
            const res = await this.$api.adminLoopOrder(params)
            if (res.code === 0) {
                this.$tip.alertDialog('用户支付成功')
                this.showWaiting = false
            } else if (res.code === 100) {
                this.adminLoopFn(id)
            } else {                
                this.showWaiting = false
                this.$tip.toast(res.msg,'none')
            } 
        }
    },
}
</script>

<style lang="scss">
.business-banner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    margin-bottom: 5px;
    .scan-tip {
        font-size: 24rpx;
        color: #666666;
        margin-bottom: 100rpx;
    }
    .scan-btn {
        line-height: 75rpx;
        text-align: center;
        color: #fff;
        width:194rpx;
        height:75rpx;
        background:rgba(255,50,118,1);
        border-radius:38rpx;
    }
    .loading-container {
        width: 100vw;
        height: 100vh;
        .mask {
            position: fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            background: #888;
            opacity: .5;
            z-index: 10;
        }
        .container {
            display: flex;
            align-items: center;
            flex-direction: column;
            width: 600rpx;
            height: 600rpx;
            position: fixed;
            top:0;
            left:0;
            right:0;
            bottom:0;
            margin: auto;
            background: #fff;
            z-index: 11;
            border-radius: 10rpx;
            padding-top: 40rpx;
        }
        .loading-warning {
            margin-top:10rpx;
        }
    }
}
</style>