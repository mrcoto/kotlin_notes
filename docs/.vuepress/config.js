module.exports = {
  base: '/kotlin_notes/dist/',
  title: 'Kotlin',
  description: 'Apuntes de Kotlin',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: 'Inicio', link: '/' },
      { text: 'GitHub', link: 'https://github.com/mrcoto/kotlin_notes/' }
    ],
    sidebar: [
      {
        title: 'Comenzando',
        path: '/content/chapter1',
        collapsable: true,
        sidebarDepth: 2,
        children: [
          '/content/chapter1',
          '/content/chapter2',
          '/content/chapter3',
          '/content/chapter4',
          '/content/chapter5',
          '/content/chapter6',
          '/content/chapter7',
          '/content/chapter8',
        ]
      },
    ],
    lastUpdated: 'Última Vez Actualizado', // string | boolean
  }
}