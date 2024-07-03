<template>
	<view class="protocol">
		<rich-text :nodes="info"></rich-text>
	</view>
</template>

<script>
export default {
	data() {
		return {
			info: ''
		};
	},
	onLoad() {
		this.getProtocol();
	},
	methods: {
		getProtocol() {
			this.$request.post({
				url: 'user/sysParams/getAgreement',
				params: {
					type: 2
				},
				success: (res) => {
					res = res.replace(/\<img(.*?)src/g, '<img style="max-width:100%!important;height:auto;display:block;" src');
					res = res.replace(/\<p/g, '<p style="line-height:1.8;word-break: break-all;"');
					res = res.replace(/\<p style="line-height:1.8;word-break: break-all;"\>\<img/g, '<p><img');
					this.info = res;
				},
				finally: () => {}
			});
		}
	}
};
</script>

<style scoped>
.protocol {
	padding: 46rpx;
}
</style>
