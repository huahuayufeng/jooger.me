<!--
 * @desc Footer
 * @author Jooger <iamjooger@gmail.com>
 * @date 2018-09-24 14:56:16
 -->
<template>
  <footer class="footer">
    <div class="wrapper">
      <div class="copyright">
        <span>版权所有 © {{ new Date() | dateFormat('YYYY') }} <nuxt-link to="/about" v-if="setting.personal.user">{{ setting.personal.user.name }}</nuxt-link>. 保留所有权利</span>
        <a href="http://www.miitbeian.gov.cn" target="_blank" rel="noopener" class="record">
          豫ICP备17040457号
        </a>
      </div>
      <div class="power-by">
        Powered by
        <a class="link" target="_blank" rel="noopener" href="https://github.com/nuxt/nuxt.js">Nuxt.js</a>、
        Design by
        <a class="link" target="_blank" rel="noopener" :href="'https://github.com/jo0ger'" v-if="setting.personal.user">{{ setting.personal.user.name }}</a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" src="./index.ts"></script>

<style lang="stylus" scoped src="./index.styl"></style>
