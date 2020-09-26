module.exports = {
  rollup(config) {
    return {
      ...config,
      output: { ...config.output, banner: '#! /usr/bin/env node\n' },
    }
  },
}
