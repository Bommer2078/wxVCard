<template>
    <view class="buy-page">
        <view class="container-cover">
            <view class="vcard-name">{{vCardBaseInfo.name}}</view>
            <view style="margin-bottom: 180rpx;">                
                <view 
                    class="specs" 
                    v-for="(item,index) in specsArr" 
                    :key="index" 
                    :class="{'active-item':skuId === item.id}"
                    @click="choseItem(item)">
                    <view class="specs-title">
                        {{item.name}}
                        <view class="specs-tip">
                            场馆特惠
                        </view>
                    </view>
                    <view class="price">
                        ￥{{item.price | priceText}}
                    </view>
                    <image class="confirm-img" src="../../static/confirm.png" v-if="skuId === item.id"/>
                </view>
            </view>
            <view class="open-btn" @click="handlePay" v-if="showPayBtn">立即开通</view>
        	<login-btn btn-txt="快速登录" v-else></login-btn>
        </view>
    </view>
</template>

<script>
import { mapState } from 'vuex' 
import md5 from '../../libs/md5.min.js'
import loginBtn from '../../components/loginBtn'
export default {
    data() {
        return {
            skuId: '',
            vCardId: '',
            forbidClick: false,
            venueId: '',
            expandValue: ''
        }
    },    
    onLoad (option) {
        this.vCardId = option.vCardId
        this.venueId = option.venueId
        this.expandValue = option.expandValue
        this.getVCardObj()
    },  
	onShow() {		
		if (wx.canIUse('hideHomeButton')) {
			wx.hideHomeButton()
		}
	},  
    computed: {
        ...mapState(['vCardBaseInfo','userInfo']),
        specsArr() {
            let obj =  JSON.parse(JSON.stringify(this.vCardBaseInfo))
            if (obj) {
                return obj.sku_arr
            }
            return []
        },
        showPayBtn () {
            return this.userInfo && this.userInfo.openid
        }
    },
	components: {
		loginBtn
	},
    watch: {
        specsArr(newVal) {
            if (newVal && newVal.length === 1) {
                this.skuId = newVal[0].id
            }
        }
    },
    filters: {
        priceText(price) {
            return (price/100).toFixed(2)
        }
    },
    methods: {
        async getVCardObj () {                                
            let params = {
                id: this.vCardId
            }               
            const res = await this.$api.getCardDetail(params)
            if (res.code === 0) {
                this.$store.commit('SET_TICKET_OBJ',res.data)
            }       
        },
        choseItem (item) {
            this.skuId = item.id
        },
        async handlePay () {
            if (this.forbidClick) return
            if (!this.skuId) {
                this.$tip.toast('请选择规格','none')
                return
            }
            this.forbidClick = true
            let pramas = {
                card_id: this.vCardId,
                card_sku_id: this.skuId,
                venue_id: this.venueId,
                expand_value: this.expandValue,
            }
            const res = await this.$api.purchase(pramas)
            if (res.code === 0) {
                this.handleWxPay(res.data.id)
                this.$tip.toast('下单成功','none')
            } else {  
                this.$tip.alertDialog(res.msg) 
                setTimeout(() => {                    
                    this.forbidClick = false
                },3000)             
            }
        },
        async handleWxPay (id) {
            let pramas = {
                order_id: id
            }
            const res = await this.$api.wxPay(pramas)
            if (res.code === 0) {
                this.payConfirm(res.data)
            } else {  
                this.$tip.alertDialog(res.msg) 
                setTimeout(() => {                    
                    this.forbidClick = false
                },3000)             
            }
        },
        payConfirm (obj) {
            let timeStamp = new Date().getTime()
            let paySign = `appId=wx1e383d6c91e8432f&nonceStr=${obj.nonce_str}&package=prepay_id=${obj.prepay_id}&signType=MD5&timeStamp=${timeStamp}&key=0cd82b0fa72de1948bfee7d277c42053`
            paySign = md5(paySign)
            let that = this
            uni.requestPayment({
                timeStamp: String(timeStamp),
                nonceStr: obj.nonce_str,
                package: `prepay_id=${obj.prepay_id}`,
                signType: 'MD5',
                paySign: paySign,
                success: function() {                    
                    that.$tip.alertDialog(
                        '支付成功，请跳转订单查看',
                        '好的','不用了').then(() => {
                            uni.redirectTo({
                                url: '/pages/orderList/orderList',
                            });
                        }).catch(() => {                            
                            uni.switchTab({
                                 url: '/pages/main/main'
                            });
                        }) 
                },
                fail: function(err) {                       
                    that.$tip.toast(`支付失败，请查看订单`,'none')
                }
            })
        }, 
    },
}
</script>

<style lang="scss">
    .buy-page {
        display: flex;
        width: 100%;
        height: 100vh;
        padding: 15rpx 15rpx 0;
        background: #F3F3F3;
        .container-cover {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 1075rpx;
            padding-top: 25rpx;
            background: #fff;
            .vcard-name {
                width: 100%;
                padding-left: 20upx;
                margin-bottom: 30upx;
            }
            .specs {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 696rpx;
                height: 105rpx;
                color: #727272;
                border-radius: 10rpx;
                margin-bottom: 40rpx;
                border:1px solid rgba(193,193,193,1);
                .specs-title {
                    display: flex;
                    font-weight: 700;
                    align-items: center;
                    justify-content: space-between;
                    font-size: 32rpx;
                    margin-left: 30rpx;
                    .specs-tip {
                        width: 80rpx;
                        height: 24rpx;
                        color: #666;
                        font-size: 18rpx;
                        font-weight: 400;
                        line-height: 24rpx;
                        text-align: center;
                        border-radius: 12rpx;
                        margin-left: 16rpx;
                        border: 1px solid #D4D4D4;
                    }
                }
                .price {
                    font-size: 30rpx;
                    margin-right: 18rpx;
                }
            }
            .active-item {
                border: 2px solid #FF3276;
                .specs-title {
                    color: #FF3276;
                }
                .price {
                    color: #FF3276;
                }
            }
            .exchange-btn {                
                width: 696rpx;
                height: 105rpx;
                position: relative;
                font-weight: 700;
                color: #727272;
                line-height: 105rpx;
                background: #F1F1F1;
                border-radius: 10rpx;
                font-size: 32rpx;
                padding-left: 30rpx;
                margin-bottom: 160rpx;
                &::after {
                    content: '';
                    position: absolute;
                    top: 40rpx;
                    right: 20rpx;
                    width: 20rpx;
                    height: 20rpx;
                    border: 1px solid;
                    transform: rotate(45deg);
                    border-color: #727272 #727272 transparent transparent;
                }
            }
            .open-btn {
                width: 563rpx;
                height: 80rpx;
                color: #fff;
                font-size: 34rpx;
                line-height: 80rpx;
                text-align: center;
                border-radius:20px;
                background: #FF3276;
            }
        }
        .confirm-img {
            width: 45rpx;
            height: 37rpx;
            position: absolute;
            bottom:0;
            right:0;
        }
    }
</style>