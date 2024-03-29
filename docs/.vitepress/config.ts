import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "inertiajs-table",
  description: "Inertia Table documentation",
  base: "/inertiajs-table/",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      // { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { 
            text: 'Getting Started', 
            link: '/getting-started' 
          },
        ]
      },
      {
        text: "Configuration",
        items: [
          { text: 'Props', link: '/props' },
          { text: 'Events', link: '/events' },
          { text: 'Slots', link: '/slots' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mdshack/interiajs-table' }
    ]
  }
})
