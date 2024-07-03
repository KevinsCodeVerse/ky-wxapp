import common from './common.js';

// 开始 post 请求
const startPost = (options) => {
	console.log('未登录options', options);
	let id;
	if (options.params && options.params.id) {
		id = options.params.id;
	}
	uni.request({
		url: common.baseUrl + options.url,
		header: options.header,
		method: 'POST',
		responseType: options.responseType,
		data: options.params,
		success: (res) => {
			try {
				if (res.statusCode === 200) {
					// 请求成功后根据返回的状态信息进行不同的回调
					switch (res.data.message) {
						case 'success':
							if (options.success) options.success(res.data.result, res);
							break
						case 'error':
							showError(res.data.result);
							if (options.error) options.error(res);
							if (options.allError) options.allError(res);
							break;
						case 'warning':
							if (options.warning) options.warning(res);
							break;
						case 'info':
							if (options.info) options.info(res);
							break;
						default:
							break;
					}
					if (options.requestSuccess) options.requestSuccess(res.data, res);
				} else {
					handleHttpError(res, options, id);
				}
			} catch (e) {
				console.log(e);
				if (options.allError) options.allError(res);
			} finally {
				if (options.finally) options.finally();
			}
		},
		fail: (res) => {
			handleNetworkError(res, options);
		},
	});
};

// 显示错误信息
const showError = (message) => {
	setTimeout(() => {
		uni.showToast({
			title: message,
			icon: 'none',
			duration: 2000,
		});
	}, 200);
};

// 处理 HTTP 错误
const handleHttpError = (res, options, id) => {
	switch (res.statusCode) {
		case 404:
			showError('请求错误');
			break;
		case 401:
			handleUnauthorized(options, id);
			break;
		case 403:
			showError('无权访问');
			break;
		case 500:
			showError('很抱歉, 发生了点错误');
			break;
		case 504:
			showError('无法连接到服务器');
			break;
		default:
			console.log('错误: ' + res.statusCode);
			break;
	}
	if (options.requestError) options.requestError(res);
	if (options.allError) options.allError(res);
};

// 处理未授权
const handleUnauthorized = (options) => {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	const pageQuery = currentPage.options;
	let token = options.myType == 1 ? 'merchentToken' : 'token';
	let myurl = options.myType == 1 ?
		`/pages/merchent/login/index?id=${pageQuery.id}&shopId=${pageQuery.shopId}&parentId=${pageQuery.parentId}` :
		`/pages/login/index?id=${pageQuery.id}&shopId=${pageQuery.shopId}&parentId=${pageQuery.parentId}`;

	uni.removeStorage({
		key: token,
		success: () => {
			navtolog(myurl);
		},
	});
};

// 处理网络错误
const handleNetworkError = (res, options) => {
	try {
		switch (res.errMsg) {
			case 'request:fail timeout':
				showError('请求超时');
				break;
			case 'request:fail ':
				showError('连接超时');
				break;
		}
		console.log('errMsg', res.errMsg);
		if (options.allError) options.allError();
	} catch (e) {
		if (options.allError) options.allError();
	} finally {
		if (options.finally) options.finally();
	}
};

const getLoginCode = () => {
	// 发起微信授权登录
	getUserInfo((userInfo) => {
		uni.login({
			success: (res) => {
				if (res.code) {
					// 拿到 code, 请求给后台
					uni.showLoading({
						title: '微信授权登录中...',
						mask: true,
					});
					login(res.code, userInfo);
				}
			},
			fail: () => {
				uni.hideLoading();
			},
		});
	});
};

// 用户登录
const login = (code, userInfo) => {
	post({
		url: 'wechat/autho/get',
		params: {
			code,
			nickName: userInfo.nickName,
			avatarUrl: userInfo.avatarUrl,
		},
		success: (result) => {
			uni.setStorage({
				key: 'token',
				data: result.token,
				success: () => {
					console.log('登录成功');
					uni.showToast({
						title: '登录成功',
						icon: 'success',
						duration: 1500,
					});
					// 重新加载当前页面的 onLoad 方法
					const pages = getCurrentPages()[getCurrentPages().length - 1];
					pages.onLoad();
					pages.onShow();
				},
			});
		},
		allError: () => {
			uni.hideLoading();
		},
	});
};

// 获取用户信息
const getUserInfo = (callback) => {
	uni.showLoading({
		title: '微信授权登录中...',
		mask: true,
	});
	uni.getUserProfile({
		desc: '获取你的昵称、头像、地区及性别',
		success: (res) => {
			callback(res.userInfo);
		},
		fail: () => {
			uni.hideLoading();
			uni.navigateTo({
				url: '/pages/login/index',
			});
		},
	});
};
// post 请求
const post = (options) => {
	if (!options.header) options.header = {};
	// 设置请求头
	options.header['Content-Type'] = 'application/x-www-form-urlencoded';
	// 获取登录权限
	let token = options.myType == 1 ? 'merchentToken' : 'token';
	uni.getStorage({
		key: token,
		success: (res) => {
			options.header.Authorization = res.data;
			startPost(options);
		},
		fail: () => {
			startPost(options);
		},
	});
};

// get 请求
const get = (options) => {
	uni.request({
		url: common.baseUrl + options.url,
		data: options.data,
		method: 'GET',
		header: options.header,
		responseType: options.responseType,
		success: (res) => {
			if (res.statusCode === 200) {
				if (options.success) options.success(res.data, res);
			} else {
				console.log(options.data);
			}
		},
		fail: (res) => {
			console.log(res);
		},
	});
};

let isnavtolog = true;
const navtolog = (myurl) => {
	if (isnavtolog) {
		uni.navigateTo({
			url: myurl,
		});
		isnavtolog = false;
	}
	setTimeout(() => {
		isnavtolog = true;
	}, 500);
};

export default {
	post,
	get,
	getLoginCode,
	login,
	getUserInfo,
};