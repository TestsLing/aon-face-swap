<template>
	<Header></Header>
	<Loading :showLoading="showLoading" />
	<div>
		<!-- 页面内容 -->
		<div class="container">
			<!-- <img class="banner" src="../assets/images/banner.png" mode=""></img>  -->

			<el-image
				style="width: 400px; height: 400px"
				:src="imageUrl"
				:zoom-rate="1.2"
				:max-scale="7"
				:min-scale="0.2"
				:preview-src-list="srcList"
				:initial-index="4"
				fit="cover"
			/>

			<el-upload
				action="https://tmp-file.aigic.ai/api/v1/upload?expires=1800&type=image/png"
				:on-success="handleUploadSuccess"
				:on-error="handleUploadError"
				>
				<el-button slot="trigger" type="primary">选取图片</el-button>
			</el-upload>

			<div class="card-container">
				<el-card
				v-for="(item, index) in items"
				:key="index"
      			:class="{ 'card-item': true, 'odd-item': index === selectedIndex, 'elected': index === selectedIndex }"
				@click="handleCardClick(index)"
				>
				<div class="card-image" :style="{ width: '100px', height: '100px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover' }"></div>
				</el-card>
			</div>

			<div class="uni-form-item error-text" v-if="showError">
				<div class="content">Please Upload your photos</div>
			</div>
			
			<div class="bottom_btn">
				<div class="spendCount">
					<img class="icon" src="../assets/icons/money.png" mode=""></img>
					<text>-8</text>
				</div>
				<button class="submitBtn" @click="formSubmit">
					<text>Generate img</text>
				</button>
			</div>


		</div>
	</div>
</template>


<script>

import { ref } from 'vue';
import { showToast } from 'vant';
import { useRouter } from 'vue-router'

import { AI } from '../lib/aonweb/aon-web.es'

import 'vant/lib/index.css';
import Header from '../components/Header.vue';
import Loading from '../components/Loading.vue';

const router = useRouter()

const showLoading = ref(false);
const showError = ref(false);

const maxSize = 30 * 1024 * 1024;

function goToComplete(url) {
	const query = { url: url }
	router.push({
		path: '/created',
		query
	})
}

const onOversize = (file) => {
	console.log(file);
	showToast('文件大小不能超过 30MB');
};

function afterRead(file) {
	const formData = new FormData();
	formData.append('file', file.file);
	console.log(formData, file.file)

	// 调用上传接口
	uploadFile(formData).then(res => {
		console.log("uploadFile", res);
		if (res.code == 200 && res.data && res.data.length) {
			targetImageUrl = res.data
		}

	}).catch(err => {
		showToast('image upload failed');
		console.log(err);
	});
}
// 上传接口
const uploadFile = async (formData) => {
	const response = await fetch('https://tmp-file.aigic.ai/api/v1/upload?expires=1800&type=image/png', {
		method: 'POST',
		body: formData
	});

	const data = await response.json();
	console.log(data);
	return data;
};

function deleteImg() {
	if (imgUrl.value) {
		const formData = new FormData();
		formData.append('file', targetImageUrl);

		// 删除文件
		formData.delete('file');
		targetImageUrl = '';
		console.log('File deleted:', formData.get('file'));
	} else {
		console.log('No file to delete')
	}
}

export default {
	data() {
    return {
      items: [
        { image: 'https://n.sinaimg.cn/sinacn10105/600/w2000h1800/20200112/158e-imztzhm9061009.jpg', name: 'Card 1' },
        { image: 'https://p0.itc.cn/images01/20230214/02ba44e985a54cbebe1ec854c0f5f9c9.jpeg', name: 'Card 2' },
        { image: 'https://5b0988e595225.cdn.sohucs.com/images/20190921/514338157e3a4766859ac405b9799747.jpeg', name: 'Card 3' },
        { image: 'https://5b0988e595225.cdn.sohucs.com/images/20180402/dc5333d8ce1e44ff8531eb6085783ea0.jpeg', name: 'Card 4' },
        { image: 'https://img1.baidu.com/it/u=2715887104,1070523227&fm=253&fmt=auto&app=138&f=JPEG?w=469&h=472', name: 'Card 5' },
      ],
      selectedIndex: 0, // 记录当前选中的卡片索引
      swapImageUrl: 'https://n.sinaimg.cn/sinacn10105/600/w2000h1800/20200112/158e-imztzhm9061009.jpg', 
	  targetImageUrl: "https://replicate.delivery/pbxt/JoBuz3wGiVFQ1TDEcsGZbYcNh0bHpvwOi32T1fmxhRujqcu7/9X2.png",
	//   imageUrl: "https://replicate.delivery/pbxt/JoBuz3wGiVFQ1TDEcsGZbYcNh0bHpvwOi32T1fmxhRujqcu7/9X2.png"
	  imageUrl: ""
	};
  },
  methods: {
	handleCardClick(index) {
		this.selectedIndex = index;
      	this.swapImageUrl = this.items[index].image;
		console.log("swapImageUrl", this.swapImageUrl)
    },
	handleUploadSuccess(response, file, fileList) {
	  console.log('上传成功', response, file, fileList);
	  afterRead(file)
	},
	handleUploadError(error, file, fileList) {
	  console.log('上传失败', error, file, fileList);
	},
	handleBeforeUpload(file) {
	  // 在此处可以进行图片的预处理，例如压缩、裁剪等
	  console.log('上传前', file);
	},
	async formSubmit() {
	console.log("AI from submit")
	 
	showLoading.value = true
	try {
		// AI 使用方法
		const ai_options = {
			//Please replace with your own API key or jwt token.
			auth: "Rbhpcp0FKNrYNA1nZkrwrIbD0YSSRlVG",
			// host: "http://localhost:8080"
		}

		const aonet = new AI(ai_options)

		const data = {
			input:{
				"swap_image": this.targetImageUrl,
				"target_image": this.swapImageUrl,
			}
		}
		console.log("formSubmit data", data)
		let response = await aonet.prediction("/predictions/ai/face-swap", data)
		console.log("test", response)

		if (response.task.exec_code == 200 && response.task.is_success) {
			showLoading.value = false
			
			let url = response.output
			if (Array.isArray(response.output)) {
				url = response.output && response.output.length && response.output[0]
			}
			if (typeof url == 'object' || typeof url == 'Object') {
				return
			}
			this.imageUrl = url
			goToComplete(url)
		} else {
			showLoading.value = false
			showToast('AI processing failed')
		}
	} catch (error) {
		showLoading.value = false
		showToast('AI processing failed')
	}

}
  },
};

</script>


<style scoped>
.banner {
	width: 100%;
	height: 27.73vw;
	margin-top: 8.53vw;

	margin-bottom: 8.53vw;
}

.uni-form-item .title {
	font-family: Roboto-Bold;
	font-weight: bold;
	font-size: 3.73vw;
	color: #000000;
	text-align: left;
	font-style: normal;
	text-transform: none;
	margin-bottom: 2.13vw;
}

.uni-form-item {
	margin-bottom: 8.53vw;
}

.uni-form-item .content {
	width: 100%;
	height: 14.93vw;
	background: #F1F1F1;
	border-radius: 1.07vw;
	display: flex;
	align-items: center;
	padding: 0 3.2vw;
	box-sizing: border-box;

}

.error-text .content {
	background-color: #F3A32B;
	font-size: 3.2vw;
	color: #fff;
}

.uni-form-item .content input {
	width: 100%;
	font-size: 3.2vw;
	font-family: Roboto-Regular;
	border: none;
	outline: none;
	background-color: #F1F1F1;
}

.upload {
	width: 100%;
	display: flex;
	align-items: center;
}

.upload-before text {
	color: #575757;
	font-size: 3.2vw;
	font-family: Roboto-Regular;
}

.upload-done {
	justify-content: space-between;
}

.uploadIcon {
	width: 6.4vw;
	height: 6.4vw;
	margin-right: 2.13vw;
}

.upload-res {
	width: auto;
	max-height: 8.53vw;
}

.deleteIcon {
	height: 5.07vw;
	width: 5.07vw;
}


.bottom_btn .spendCount {
	width: 19.2vw;
	height: 9.07vw;
	background: #F1F1F1;
	border-radius: 1.07vw;
	display: flex;
	justify-content: center;
	align-items: center;
}

.bottom_btn .spendCount .icon {
	height: 6.4vw;
	width: 6.4vw;
	margin-right: 1.07vw;
}

.bottom_btn .submitBtn {
	width: 64.8vw;
	height: 9.07vw;
	background: #000000;
	box-shadow: 1.07vw 1.07vw 2.13vw .13vw rgba(0, 0, 0, 0.32);
	border-radius: 1.07vw;
	display: flex;
	justify-content: center;
	align-items: center;

}

.bottom_btn .submitBtn text {
	font-size: 3.73vw;
	font-weight: bold;
	background: linear-gradient(182deg, #2F54EB 0%, #FF26A8 100%);
	-webkit-background-clip: text;
	color: transparent;
	background-clip: text;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
}

.card-item {
  width: 20%;
  padding: 10px;
  box-sizing: border-box;
}

.odd-item {
  background-color: #f0f0f0;
}

.card-image {
  width: 100%;
  height: 100%;
}
</style>
