<template>
	<view>
		<view style="padding: 45rpx 30rpx;font-size: 30rpx;display: flex;gap: 20rpx;flex-direction: column;">
			<view style="font-weight: 600;">
				提现{{unit==1?'积分':'金额'}}
			</view>
			<view>
				<u-field v-model="addFrom.money" :placeholder="'请输入'+unit==1?'积分':'金额'" border-bottom :label-width="unit==1?100:50" 
				 :label="unit==1?'积分':'￥'" focus :field-style="{'font-size':'50rpx','height':'55rpx'}" label-align="left">
				</u-field>
			</view>
			<view style="font-size: 20rpx;color: #666;">
				目前余额{{unit==1?balance+'积分':'￥'+balance}}，最低提现为{{unit==1?'10.00积分':'￥10.00'}}
			</view>
		</view>
		<view style="display: flex;flex-direction: column;align-items: center;gap: 25rpx;margin-top: 20rpx">
			<view
				@click="openShow"
				style="width: 280rpx;height: 80rpx;border-radius: 40rpx;background: linear-gradient(90.00deg, #ffc200 0%, #ffac00 100%);">
				<view style="text-align: center;line-height: 80rpx;font-weight: 700;font-size: 28rpx;color: #fff;">
					申请提现至银行卡
				</view>
			</view>
			<view style="color: #FFBE00;font-size: 20rpx;" @click="openPage('pages/my/withdrawal/bankcard',2)">
				查看/修改卡号信息
			</view>
			<view style="color: #FFBE00;font-size: 20rpx;" @click="openPage('pages/my/withdrawal/list',2)">
				查看提现记录
			</view>
		</view>
		
		<u-popup v-model="show" mode="center" :closeable="true" close-icon="close-circle" custom-style="background: #3994ff00" border-radius="14">
		    <view class="box_base">
		        <view class="title">确认提现</view>
		        <view class="bor_bt">
		            <view class="fs24">提现</view>
		            <view class="price">{{unit==1?addFrom.money+'积分':'￥'+addFrom.money}} </view>
		            <view class="flex_text">
		                <view>服务费</view>
		                <view>{{unit==1?servicePrice+'积分':'￥'+servicePrice}}</view>
		            </view>
		            <view class="flex_text" v-if="service.costProportion !== '0'">
		                <view>费率</view>
		                <view>
		                    <text>{{ service.costProportion }}%</text>
		                    <text>(最低{{unit==1?service.costLimit+'积分':'￥'+service.costLimit}})</text>
		                </view>
		            </view>
		            <view class="btns" hover-class="btns_active" @click="toWithdraw">确认提现</view>
		        </view>
		    </view>
		</u-popup>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				addFrom: {
					money: 0,
					tenantId: '',
				},
				show: false,
				service:{
					costProportion: 0,
					costLimit: 0,
				},
				load: false,
				balance: 0,
				unit:'',
			}
		},
		onLoad(e) {
			this.unit = uni.getStorageSync('unit');
			this.balance = e.balance;
			this.addFrom.tenantId = uni.getStorageSync("infoId");
			this.getServiceBank();
		},
		computed:{
			servicePrice(){
				let price = this.service.costProportion*this.addFrom.money/100;
				if(price>this.service.costLimit){
				  return Number(price).toFixed(2)
				}else{
				  return this.service.costLimit
				}
			},
		},
		methods: {
			toWithdraw(){
				if(this.load) return;
				this.load = true;
				uni.showLoading({
					title:'加载中'
				})
				if(this.addFrom.money < 10) {
					uni.showToast({
						title: '最低提现10!',
						icon: 'none'
					})
					this.load = false;
					uni.hideLoading();
					return;
				}
				this.$request.post({
					url: 'user/userBankCard/withdrawGoods',
					params: this.addFrom,
					success: (res) => {
						this.show = false;
						this.balance = res;
						uni.showToast({
							title: '提现成功,请等待审核',
							icon: 'none',
						});
					},
					finally: (e) => {
						this.load = false;
						uni.hideLoading();
					}
				});
			},
			getServiceBank(){
				this.$request.post({
					url: 'user/userBankCard/serviceBank',
					params: {
						platform: 2,
						tenantId: this.addFrom.tenantId,
					},
					success: (res) => {
						this.service = res;
					}
				});
			},
			openShow(){
				if(!this.addFrom.tenantId) {
					uni.showToast({
					    title: '商家不存在，不能提现',
					    icon: 'none'
					});
					return;
				}
				if (this.addFrom.money < 10) {
				    uni.showToast({
				        title: '最低提现10!',
				        icon: 'none'
				    });
				    return;
				}
				this.show = true;
			},
			openPage(path, type) {
				if (!path) {
					uni.navigateBack({
						delta: 1
					});
				}
				var pages = getCurrentPages() // 获取栈实例
				let currentRoute = pages[pages.length - 1].route; // 获取当前页面路由
				if (path === currentRoute) {
					return;
				}			
				if (type==1) {				
					uni.redirectTo({
						url: path
					})
				} else {
					this.$u.route({
						url: path
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	/deep/.u-field-inner.data-v-1c764f86 {
		align-items: baseline;
	}

	/deep/.u-label-text.data-v-1c764f86 {
		font-size: 50rpx;
	}
	/* 弹窗 */
	.box_base {
	    position: relative;
	    overflow: hidden;
	
	    width: 583rpx;
	    height: 556rpx;
	    background: #ffffff;
	    border-radius: 17rpx;
	    text-align: center;
	}
	.box_base .title {
	    font-size: 33rpx;
	    font-weight: 700;
	    color: #333333;
	    line-height: 100rpx;
	    margin-bottom: 25rpx;
	    border-bottom: 1px solid #66666615;
	}
	.box_base .title {
	    font-size: 33rpx;
	    font-weight: 700;
	    color: #333333;
	    line-height: 100rpx;
	    border-bottom: 1px solid #66666615;
	}
	.bor_bt {
	    padding: 0 50rpx;
	}
	.box_base .price {
	    font-size: 58rpx;
	    font-weight: 700;
	    padding: 15rpx;
	    color: #333333;
	    line-height: 100rpx;
	    border-bottom: 1px solid #66666615;
	}
	.flex_text {
	    display: flex;
	    justify-content: space-between;
	    line-height: 50rpx;
	    margin-top: 20rpx;
	    color: #666666;
	}
	.btns {
	    position: absolute;
	    width: 100%;
	    bottom: 0;
	    left: 0;
	    height: 92rpx;
	    background: #ffc200;
	    line-height: 92rpx;
	    font-size: 29rpx;
	    font-weight: 400;
	    text-align: center;
	    color: #ffffff;
	}
	.btns_active {
	    background: #f1dea5;
	}
</style>