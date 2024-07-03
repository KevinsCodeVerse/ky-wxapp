<script>
export default {
	data() {
		return {
			isManage: false,
			params: {
				pageNo: 1,
				pageSize: 200
			},
			addresses: []
		};
	},
	computed: {
		hasSelected() {
			const result = this.addresses.some((address) => address.isSelected);
			console.log('hasSelected:', result);
			return result;
		}
	},
	watch: {
		hasSelected(newVal) {
			if (newVal) {
				const defaultAddress = this.addresses.find((address) => address.isSelected);
				if (defaultAddress) {
					this.setDefaultAddress(defaultAddress);
				}
			}
		}
	},
	onLoad() {
		this.getAddressList();
	},
	onShow() {
		this.getAddressList();
	},
	methods: {
		getAddressList() {
			this.$request.post({
				url: '/user/userAddress/list',
				params: this.params,
				success: (res) => {
					this.addresses = res.list.map((address) => {
						address.isSelected = false;
						return address;
					});
					console.log('地址', res);
				}
			});
		},
		toggleManage() {
			this.isManage = !this.isManage;
			if (!this.isManage) {
				this.addresses.forEach((address) => (address.isSelected = false));
			}
		},
		editAddress(row) {
			const query = JSON.stringify(row);
			uni.navigateTo({
				url: `/pages/my/addSite?query=${query}`
			});
		},
		addAddress() {
			uni.navigateTo({
				url: '/pages/my/addSite'
			});
		},
		setDefaultAddress(address) {
			console.log('setDefaultAddress called with address:', address);
			this.$request.post({
				url: '/user/userAddress/update',
				params: {
					id: address.id,
					isDefault: 1
				},
				success: () => {
					this.addresses.forEach((addr) => {
						addr.isDefault = addr.id === address.id ? 1 : 0;
						addr.isSelected = addr.id === address.id;
					});
					uni.showToast({
						icon: 'success',
						title: '设置默认地址成功'
					});
				},
				fail: () => {
					uni.showToast({
						icon: 'none',
						title: '设置默认地址失败'
					});
				}
			});
		},
		deleteAddress(row) {
			this.$request.post({
				url: '/user/userAddress/delete',
				params: {
					ids: JSON.stringify([row.id])
				},
				success: (res) => {
					uni.showToast({
						icon: 'success',
						title: '删除成功'
					});
					this.getAddressList();
				}
			});
		},
		selectAddress(index) {
			console.log('selectAddress called for index:', index);
			this.$set(this.addresses, index, {
				...this.addresses[index],
				isSelected: !this.addresses[index].isSelected
			});
		},
		selectDefaultAddress(index) {
			console.log('selectDefaultAddress called for index:', index);
			this.addresses.forEach((address, i) => {
				address.isSelected = i === index;
			});
			this.setDefaultAddress(this.addresses[index]);
		},
		deleteSelectedAddresses() {
			const ids = this.addresses.filter((address) => address.isSelected).map((address) => address.id);
			console.log('ids', ids);
			this.$request.post({
				url: '/user/userAddress/delete',
				params: {
					ids: JSON.stringify(ids)
				},
				success: (res) => {
					uni.showToast({
						icon: 'success',
						title: '删除成功'
					});
					this.getAddressList();
				}
			});
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
