export default {
  title: '小潮吧学笔记',
  description: '学个鸡儿学.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide' },
      {
        text: 'Dropdown Menu',
        items: [
          { text: 'Item A', link: '/item-1' },
          { text: 'Item B', link: '/item-2' },
          { text: 'Item C', link: '/item-3' }
        ]
      }
    ],
    sidebar: [
      {
        text: 'Vue',
        items: [
          { text: 'Vue3', link: '/vue3' },
          { text: 'Item B', link: '/item-b' },
        ]
      },
      {
        text: 'Section B',
        items: [
          { text: 'Item C', link: '/item-c' },
          { text: 'Item D', link: '/item-d' },
        ]
      }
    ]
  }
}