<template>
	<view>
	    <!-- <view class="remark">
	        <text>账单详情</text>
	        <text>收入/支出</text>
	    </view> -->
	    <!-- <tab class="tabss" items="{{[{name:1,text:'可用余额'},{name:2,text:'冻结余额'}]}}" active="{{1}}" bind:change="tabChange"></tab> -->
	    <view class="telist">
	        <view class="tecard" v-for="(item, index) in list" :key="index">
	            <view class="toad">
	                <view style="display: flex">
	                    <view>{{ item.remark + '  ' }}</view>
	                    （
	                    <view v-if="item.type == 1" class="add">收入</view>
	                    <view v-if="item.type == 2" class="error">支出</view>
	                    ）
	                </view>
	                <view class="time">{{item.createTime}}</view>
	            </view>
	
	            <view v-if="active == 1">
	                <view class="price add" v-if="item.type == 1">{{ '+' }}{{unit==1?item.amount+'积分':'￥'+item.amount}}</view>
	                <view class="price error" v-if="item.type == 2">{{ '-' }}{{unit==1?item.amount+'积分':'￥'+item.amount}}</view>
	            </view>
	        </view>
	        <u-loadmore :status="loadStatus" @loadmore="getList" v-if="list.length>0"></u-loadmore>
			<u-empty v-if="list.length==0" icon-size="550rpx" src="../../../static/index/noEmty.png" text=" "></u-empty>
	    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
				],
				params:{
					tenantId: '',
					pageNo: 0,
					pageSize: 20,
				},
				active: 1,
				loadStatus: 'loadmore',
				
				finish: false,
				loading: false,
				unit:'',
			}
		},
		onLoad() {
			this.unit = uni.getStorageSync('unit');
			this.params.tenantId = uni.getStorageSync('infoId');
			this.getList();
		},
		onReachBottom() {
			this.getList();
		},
		methods: {
			getList() {
				if(this.loadStatus != 'loadmore') return;
				this.loadStatus = 'loading';
				this.params.pageNo += 1;
				this.$request.post({
				  url: 'user/tenantInviteFlow/list',
				  params: this.params,
				  success: (result) => {
					  if(result.length < this.params.pageSize) {
						  this.loadStatus = 'nomore';
					  }else {
						  this.loadStatus = 'loadmore';
					  }
					  this.list = [...this.list, ...result];
				  },
				  catch: (e) => {
				  },
				  finally: (e) => {
				  }
				});
			},
		}
	}
</script>

<style lang="scss">
.remark {
    font-weight: bold;
    padding: 0 30rpx;
    height: 68rpx;
    line-height: 68rpx;
    display: flex;
    justify-content: space-between;
}
.telist {
    background-color: #fff;
}
.tecard {
    padding: 16rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
}
.tecard .time {
    color: #999999;
    font-size: 20rpx;
    margin-top: 4rpx;
}
.tecard .price {
    color: rgb(245, 86, 86);
    font-weight: bold;
    font-size: 40rpx;
    letter-spacing: 0;
}
.tecard .add {
    color: #32ca64;
}
.error {
    color: rgb(245, 86, 86);
}
.lanse {
    color: #3994ff !important;
}
.tecard .freeze {
    color: #636363;
}
.tecard .toad {
    width: calc(100% - 250rpx);
}
/* 滑动加载 */
.loading {
    text-align: center;
    padding: 30rpx 0;
}
.finish {
    font-size: 28rpx;
    color: #999999;
    padding-bottom: 20rpx;
}
</style>
