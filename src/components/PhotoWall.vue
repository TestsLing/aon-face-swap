<template>
    <div>

      <ul>
        <li v-for="photo in photos" :key="photo.id">
            <el-card style="max-width: 480px">
                <img :src="photo.url" :alt="photo.alt" @click="selectPhoto(photo)">
                <div class="title">明星</div>
            </el-card>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        photos: [
        { url: 'https://n.sinaimg.cn/sinacn10105/600/w2000h1800/20200112/158e-imztzhm9061009.jpg', name: 'Card 1' },
        { url: 'https://p0.itc.cn/images01/20230214/02ba44e985a54cbebe1ec854c0f5f9c9.jpeg', name: 'Card 2' },
        { url: 'https://5b0988e595225.cdn.sohucs.com/images/20190921/514338157e3a4766859ac405b9799747.jpeg', name: 'Card 3' },
        { url: 'https://5b0988e595225.cdn.sohucs.com/images/20180402/dc5333d8ce1e44ff8531eb6085783ea0.jpeg', name: 'Card 4' },
        ]
      };
    },
    methods: {
      selectPhoto(photo) {
        // 在这里处理选择照片的逻辑
        console.log('Selected photo:', photo);
      }
    }
  };
  </script>
  
  <style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline-block;
  margin: 10px;
}

img {
  width: 200px;
  height: 200px;
  object-fit: cover;
}
  </style>