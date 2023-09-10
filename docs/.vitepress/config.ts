import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "inertiajs-table",
  description: "Inertia Table documentation",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mdshack/interiajs-table' }
    ]
  }
})
