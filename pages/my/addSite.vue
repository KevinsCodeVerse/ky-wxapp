<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收件人</view>
				<input v-model="form.name" type="text" placeholder-class="line" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input v-model="form.phone" type="text" placeholder-class="line" placeholder="请填写收货人手机号" />
			</view>
			<view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input :value="displayRegion" disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
			</view>
			<view class="item address">
				<view class="left">详细地址</view>
				<textarea v-model="form.address" type="text" placeholder-class="line" placeholder="请选择街道、楼牌等" />
			</view>
			<view class="bottom">
				<view class="default">
					<view class="left">
						<view class="set">设为默认</view>
					</view>
					<view class="right">
						<switch :checked="form.isDefault == 1 ? true : false" @change="changeDefault" color="#002FA7" />
					</view>
				</view>
			</view>
		</view>

		<u-picker mode="region" ref="uPicker" v-model="show" :default-region="defaultRegion" @confirm="onRegionConfirm" />
		<view class="addSite" @tap="saveAddress">
			<view class="add">保存</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			type: null, //标记保存跳转
			form: {
				id: '',
				name: '',
				phone: '',
				region: '',
				address: '',
				isDefault: false
			},
			defaultRegion: []
		};
	},
	computed: {
		displayRegion() {
			return this.form.region;
		}
	},
	onLoad(options) {
		if (options.query) {
			this.getAddressDetail(JSON.parse(options.query));
		}
		if (options.type) {
			this.type = options.type;
		}
	},
	onReady() {
		this.setDefaultRegion();
	},
	methods: {
		getAddressDetail(query) {
			this.form = {
				id: query.id,
				address: query.address,
				name: query.name,
				isDefault: query.isDefault,
				phone: query.phone,
				region: query.region
			};
			this.setDefaultRegion();
		},
		setDefaultRegion() {
			if (!this.form.region) return;
			const regionArray = this.form.region.split(' ');
			this.defaultRegion = regionArray;
		},
		showRegionPicker() {
			this.show = true;
		},
		onRegionConfirm(e) {
			const { province, city, area } = e;
			this.form.region = `${province.label} ${city.label} ${area.label}`;
			this.defaultRegion = [province.label, city.label, area.label];
		},
		changeDefault(e) {
			this.form.isDefault = e.detail.value ? 1 : 0;
		},
		restForm() {
			this.form = {
				id: '',
				name: '',
				phone: '',
				region: '',
				address: '',
				isDefault: false
			};
		},
		saveAddress() {
			if (!this.validateForm()) {
				return;
			}
			const data = {
				id: this.form.id ? this.form.id : '',
				address: this.form.address,
				isDefault: this.form.isDefault ? 1 : 0,
				name: this.form.name,
				phone: this.form.phone,
				region: this.form.region
			};
			if (this.form.id) {
				this.$request.post({
					url: 'user/userAddress/update',
					params: data,
					success: (res) => {
						uni.showToast({
							title: '修改成功',
							icon: 'success'
						});
						uni.navigateBack();
						this.restForm();
					},
					fail: (err) => {
						uni.showToast({
							title: '修改失败，请重试',
							icon: 'none'
						});
					}
				});
			} else {
				this.form.id = '';
				this.$request.post({
					url: 'user/userAddress/add',
					params: data,
					success: (res) => {
						uni.showToast({
							title: '新增成功',
							icon: 'success'
						});
						if (this.type == 1) {
							setTimeout(() => {
								uni.navigateBack(1);
							}, 1000);
						}
						uni.navigateBack();
						this.restForm();
					},
					fail: (err) => {
						uni.showToast({
							title: '新增失败，请重试',
							icon: 'none'
						});
					}
				});
			}
		},
		validateForm() {
			const phoneRegex = /^1[3-9]\d{9}$/; // 简单的手机号正则表达式，适用于中国大陆手机号
			if (!this.form.name) {
				uni.showToast({
					title: '请填写收件人姓名',
					icon: 'none'
				});
				return false;
			}
			if (!this.form.phone) {
				uni.showToast({
					title: '请填写收件人手机号',
					icon: 'none'
				});
				return false;
			}
			if (!phoneRegex.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式不正确',
					icon: 'none'
				});
				return false;
			}
			if (!this.form.region) {
				uni.showToast({
					title: '请选择所在地区',
					icon: 'none'
				});
				return false;
			}
			if (!this.form.address) {
				uni.showToast({
					title: '请填写详细地址',
					icon: 'none'
				});
				return false;
			}
			return true;
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-weight: 400;
	font-size: 32rpx;
	text-align: left;
	color: #c8c9cc;
}
.wrap {
	background: #f5f5f5;
	padding: 30rpx 25rpx;
	height: 100vh;
	.top {
		background-color: #ffffff;
		border-radius: 25rpx;
		padding: 0 42rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				min-width: 165rpx;
				font-weight: 400;
				font-size: 34rpx;
				text-align: left;
				color: #646566;
			}
			input {
				text-align: left;
			}
		}

		.address {
			padding: 20rpx 0;
			textarea {
				width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				padding: 20rpx;
				font-weight: 400;
				font-size: 32rpx;
				text-align: left;
			}
		}
	}
	.bottom {
		padding: 10rpx 0;
		padding-right: 0;
		background-color: #ffffff;
		font-size: 28rpx;
		border-bottom: solid 2rpx $u-border-color;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
			}
		}
		.default {
			display: flex;
			justify-content: space-between;
			line-height: 100rpx;
			.left {
				font-weight: 400;
				font-size: 32rpx;

				text-align: left;
				color: #646566;
			}
		}
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 100rpx;
	position: absolute;
	bottom: 30rpx;
	left: 80rpx;
	height: 80rpx;
	border-radius: 40rpx;
	background: #002fa7;
	font-weight: 700;
	font-size: 28rpx;
	text-align: center;
	color: #fff;
	border: 2rpx solid #00000000;
	.add {
		display: flex;
		align-items: center;
		color: #ffffff;

		.icon {
			margin-right: 10rpx;
		}
	}
}
</style>
