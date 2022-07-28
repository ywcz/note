export default {
  title: 'ywcz',
  description: '学个鸡儿学.',
  markdown: {
    lineNumbers: true,
  },
  themeConfig: {
    nav: [
      {
        text: 'Menu',
        items: [
          { text: 'Java', link: '/java/' },
          { text: 'Javascript', link: '/javascript/' },
        ]
      }
    ],
    sidebar: [
      {
        text: 'javascript',
        items: [
          { text: 'js', link: '/javascript/index' },
          { text: 'throw', link: '/javascript/throw' },
        ]
      },
      {
        text: 'Java',
        items: [
          { text: 'JVM', link: '/java/jvm' },
        ]
      }
    ]
  }
}