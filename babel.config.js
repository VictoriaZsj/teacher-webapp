module.exports = {
  presets: [
    '@vue/app',
    "@babel/preset-env"
  ],
  plugins: [
    [ "@babel/plugin-transform-spread" , { "loose": true }],
  ]
};