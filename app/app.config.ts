export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      neutral: 'slate'
    },
    input: {
      slots: {
        root: 'w-full'
      }
    },
    textarea: {
      slots: {
        root: 'w-full'
      }
    },
    selectMenu: {
      slots: {
        base: 'w-full'
      }
    }
  }
})
